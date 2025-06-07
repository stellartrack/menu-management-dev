const { logError } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logError(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.array) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.array(),
    });
  }

  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};

module.exports = errorHandler;
