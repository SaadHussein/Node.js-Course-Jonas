const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; //To Match Any String Between Qoutes.
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

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    } else {
        return res.status(err.statusCode).render('error', {
            title: "Something went wrong!",
            msg: err.message
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {

        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            return res.status(500).json({
                status: "error",
                message: "Something Went Wrong..!"
            });
        }
    } else {
        if (err.isOperational) {
            return res.status(err.statusCode).render('error', {
                title: "Something went wrong!",
                msg: err.message
            });
        } else {
            return res.status(err.statusCode).render('error', {
                title: "Something went wrong!",
                msg: "Please Try Again Later."
            });
        }
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.name = err.name;
        error.code = err.code;
        error.message = err.message;

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

        sendErrorProd(error, req, res);
    }
};