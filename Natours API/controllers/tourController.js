const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
    next();
};

const getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    return res.status(200).json({
        status: "success",
        count: tours.length,
        data: {
            tours: tours
        }
    });

});

const getTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const selectedTour = await Tour.findById(id).populate('reviews');

    if (!selectedTour) {
        return next(new AppError('No Tour Found With This ID', 404));
    }

    return res.status(200).json({
        status: "success",
        data: {
            tour: selectedTour
        }
    });
});

const createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    return res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    });
});

const updateTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedTour) {
        return next(new AppError('No Tour Found With This ID', 404));
    }

    return res.status(200).json({
        status: "success",
        data: {
            tour: updatedTour
        }
    });

});

const deleteTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const deletedTour = await Tour.findByIdAndDelete(id);

    if (!deletedTour) {
        return next(new AppError('No Tour Found With This ID', 404));
    }

    return res.status(204).json({
        status: "success",
        data: null
    });
});

const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        {
            $match: { _id: { $ne: "EASY" } }
        }
    ]);

    return res.status(200).json({
        status: "success",
        data: {
            stats
        }
    });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        },
        { $sort: { numTourStarts: -1 } },
        { $limit: 12 }
    ]);

    return res.status(200).json({
        status: "success",
        data: {
            plan
        }
    });
});

module.exports = {
    getAllTours, createTour, getTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan
};