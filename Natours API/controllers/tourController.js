const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
    next();
};

const getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;

        return res.status(200).json({
            status: "success",
            count: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err
        });
    };
};

const getTour = async (req, res) => {
    try {
        const id = req.params.id;
        const selectedTour = await Tour.findById(id);

        return res.status(200).json({
            status: "success",
            data: {
                tour: selectedTour
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

const createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        return res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

const updateTour = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            status: "success",
            data: {
                tour: updatedTour
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

const deleteTour = async (req, res) => {
    try {
        const id = req.params.id;
        await Tour.findByIdAndDelete(id);

        return res.status(204).json({
            status: "success",
            data: null
        });
    } catch (err) {
        return res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

module.exports = {
    getAllTours, createTour, getTour, updateTour, deleteTour, aliasTopTours
};