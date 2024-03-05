const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

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
    deleteUser
};