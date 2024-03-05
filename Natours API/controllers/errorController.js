const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; //To Match Any String Between Qoutes.
    // console.log(value);
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate Field Value: ${value}, Please Use Another Value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((err) => err.message);

    const message = `Invalid Input Data, ${errors.join(', ')}`;
    return new AppError(message, 400);
};

const handleJWTError = (err) => {
    return new AppError('Invalid Token, Please Login Again.', 401);
};

const handleTokenExpiredError = (err) => {
    return new AppError('Ypur Token has Expired, Please Login Again.', 401);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "Something Went Wrong..!"
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.name = err.name;
        error.code = err.code;

        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }

        if (error.code === 11000) {
            error = handleDuplicateFieldDB(error);
        }

        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }

        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError(error);
        }

        if (error.name === 'TokenExpiredError') {
            error = handleTokenExpiredError(error);
        }

        sendErrorProd(error, res);
    }
};