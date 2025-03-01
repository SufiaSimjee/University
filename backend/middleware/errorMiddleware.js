import colors from 'colors';

//For wrong URL
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`.red.inverse);
  res.status(404);
  next(error);
};

//For error handling
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };