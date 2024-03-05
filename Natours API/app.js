const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}



app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can Not Find ${req.originalUrl} on This Server.`
    // });

    // const err = new Error(`Can Not Find ${req.originalUrl} on This Server.`);
    // err.statusCode = 404;
    // err.status = "fail";

    next(new AppError(`Can Not Find ${req.originalUrl} on This Server.`, 404));
});




app.use(globalErrorHandler);

module.exports = app;