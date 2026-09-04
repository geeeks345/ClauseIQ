const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('[Error Handler]', err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return ApiResponse.error(res, message, 404);
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for '${field}'. Please use another value.`;
    return ApiResponse.error(res, message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    return ApiResponse.error(res, 'Validation Error', 400, message);
  }

  // Multer Error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ApiResponse.error(res, 'File size exceeds maximum allowed limit (25MB)', 400);
    }
    return ApiResponse.error(res, `File upload error: ${err.message}`, 400);
  }

  return ApiResponse.error(
    res,
    error.message || 'Internal Server Error',
    error.statusCode || 500
  );
};

module.exports = errorHandler;
