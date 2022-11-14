const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue);
  const value = Object.values(err.keyValue);
  const message = `Duplicate value in ${field} field, value: ${value}. Please use another value!!`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token please login', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, Please login again', 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: `Something went wrong`,
    msg: err.message,
  });
};

const sendErrorProduction = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or unknown error
    //  1) Log error
    // console.error('ERROR', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong !!!',
    });
  }
  // RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: `Something went wrong`,
      msg: err.message,
    });
  }
  // Programming or unknown error
  //  1) Log error
  // console.error('ERROR', err);

  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: `Something went wrong`,
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // HANDLING INVALID DATABASE ID
    let error = Object.create(err);

    // HANDLE INVALID TOUR ID ERROR LECTURE 119 JONAS SCHMEDMAN
    if (error.kind === 'ObjectId') err = handleCastErrorDB(error);

    // HANDLE DUPLICATE KEY ERROR
    if (error.code === 11000) err = handleDuplicateFieldsDB(err);

    // HANDLING MONGOOSE VALIDATION ERRORS
    if (error.name === 'ValidationError') err = handleValidationErrorDB(error);

    // Handling invalid jwt token
    if (error.name === 'JsonWebTokenError') err = handleJWTError();

    if (error.name === 'TokenExpiredError') err = handleJWTExpiredError();

    sendErrorProduction(err, req, res);
  }
};
