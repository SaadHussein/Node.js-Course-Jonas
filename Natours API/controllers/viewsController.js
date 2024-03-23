const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find({});

    res.status(200).render('overview', {
        title: "All Tours",
        tours
    });
});

const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({ path: "reviews", fields: 'review rating user' });

    if (!tour) {
        return next(new AppError('Not tour found with this name.', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

const getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: "Login into Your Account"
    });
});

const getAccount = (req, res) => {
    res.status(200).render('account', {
        title: "Your Account."
    });
};

module.exports = {
    getOverview,
    getTour,
    getAccount,
    getLoginForm
};