const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(helmet());
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//             'script-src': ["'self'", 'https://unpkg.com'],
//             'img-src': ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
//         },
//     })
// );

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'", 'data:', 'blob:'],

//             baseUri: ["'self'"],

//             fontSrc: ["'self'", 'https:', 'data:'],

//             scriptSrc: ["'self'", 'https://*.cloudflare.com'],
//             scriptSrc: ["'self'", 'https://unpkg.com'],

//             scriptSrc: ["'self'", 'https://*.stripe.com'],

//             scriptSrc: ["'self'", 'http:', 'https://*.mapbox.com', 'data:'],

//             frameSrc: ["'self'", 'https://*.stripe.com'],

//             objectSrc: ["'none'"],

//             styleSrc: ["'self'", 'https:', 'unsafe-inline'],

//             workerSrc: ["'self'", 'data:', 'blob:'],

//             childSrc: ["'self'", 'blob:'],

//             imgSrc: ["'self'", 'data:', 'blob:'],
//             imgSrc: ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],

//             connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],

//             upgradeInsecureRequests: [],
//         },
//     })
// );

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                scriptSrc: [
                    "'self'",
                    'https:',
                    'http:',
                    'blob:',
                    'https://*.mapbox.com',
                    'https://js.stripe.com',
                    'https://m.stripe.network',
                    'https://*.cloudflare.com',
                    'https://unpkg.com',
                ],
                frameSrc: ["'self'", 'https://js.stripe.com'],
                objectSrc: ["'none'"],
                styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
                workerSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https://*.tiles.mapbox.com',
                    'https://api.mapbox.com',
                    'https://events.mapbox.com',
                    'https://m.stripe.network',
                ],
                childSrc: ["'self'", 'blob:'],
                imgSrc: ["'self'", 'data:', 'blob:'],
                imgSrc: ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
                formAction: ["'self'"],
                connectSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'data:',
                    'blob:',
                    'https://*.stripe.com',
                    'https://*.mapbox.com',
                    'https://*.cloudflare.com/',
                    'https://bundle.js:*',
                    'ws://127.0.0.1:*/',

                ],
                upgradeInsecureRequests: [],
            },
        },
    })
);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: "Too Many Requests, Try Again After 1 Hour."
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist: ['duration', 'price', 'maxGroupSize', 'ratingsQuantity', 'ratingsAverage', 'difficulty']
}));

app.use(compression());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);


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