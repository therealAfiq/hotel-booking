// src/middlewares/error.middleware.js
const logger = require('../utils/logger.util');

function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}
module.exports = errorHandler;
