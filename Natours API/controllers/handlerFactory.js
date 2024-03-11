const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
        return next(new AppError('No Document Found With This ID', 404));
    }

    return res.status(204).json({
        status: "success",
        data: null
    });
});

const updateOne = (Model) => catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const updatedDocument = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedDocument) {
        return next(new AppError('No Document Found With This ID', 404));
    }

    return res.status(200).json({
        status: "success",
        data: {
            data: updatedDocument
        }
    });

});

const createOne = (Model) => catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    return res.status(201).json({
        status: "success",
        data: {
            data: newDocument
        }
    });
});

const getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if (popOptions) {
        query = query.populate(popOptions);
    }
    const selectedDocument = await query;

    if (!selectedDocument) {
        return next(new AppError('No Document Found With This ID', 404));
    }

    return res.status(200).json({
        status: "success",
        data: {
            data: selectedDocument
        }
    });
});

const getAll = (Model) => catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) {
        filter = {
            tour: req.params.tourId
        };
    }

    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
    const documents = await features.query;

    return res.status(200).json({
        status: "success",
        count: documents.length,
        data: {
            data: documents
        }
    });

});

module.exports = {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
};