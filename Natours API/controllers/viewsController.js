const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
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

const getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: "My Tours",
        tours
    });

});

const updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).render('account', {
        title: "Your Account.",
        user: updatedUser
    });
});

const alerts = (req, res, next) => {
    const alert = req.query.alert;

    if (alert === 'booking') {
        res.locals.alert = 'Your Booking was Successful! Please Check Your Email for Confirmation. If Your Booking Does Not Appear Here Immediately, Please Come Back Later.';
    }
    next();
}

module.exports = {
    getOverview,
    getTour,
    getAccount,
    getLoginForm,
    updateUserData,
    getMyTours,
    alerts
};