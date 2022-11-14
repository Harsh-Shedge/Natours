const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const cors = require('cors')

const compression = require('compression');

const path = require('path');

const cookieParser = require('cookie-parser');

// Prevent parameter pollution
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllerrs/errorController');

const app = express();

app.enable('trust proxy');

const tourRouter = require('./routes/tourRoutes.js');

const userRouter = require('./routes/userRoutes.js');

const reviewRouter = require('./routes/reviewRoutes');

const viewRouter = require('./routes/viewRoutes');

// GLOBAL MIDDLEWARE

// IMPLEMENT CORS
app.use(cors())

// SERVING STATIC FILES FOR PUG TEMPLATES
app.use(express.static(path.join(__dirname, 'public')));

// Set security Http header
// app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// RATE LIMITER
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'Please wait for some time to make another request',
});

// Limit Request form same api
app.use('/api', limiter);

// Reading data from body
app.use(express.json({ limit: '30kb' }));

// Cookie parser
app.use(cookieParser());

// PUG TEMPLATE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Data Sanitization against NoSql Query injection
app.use(mongoSanitize());

// Data Sanitization against Cross Side scripting
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'difficulty', 'price'],
  })
);

app.use(compression());

// ROUTES

// RENDERING PUG
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// HANDLING UNHANDLED ROUTES ALWAYS SHOULD BE AT THE END
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`), 404);
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
