const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        status: 'success',
        count: users.length,
        data: {
            users
        }
    });
});

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This Route is not Defined Yet."
    });
};

const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This Route is Not For Password, Please use /updateMyPassword Route.', 400));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });


    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    });
});

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null
    });
});

const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This Route is not Defined Yet."
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This Route is not Defined Yet."
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This Route is not Defined Yet."
    });
};

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
};