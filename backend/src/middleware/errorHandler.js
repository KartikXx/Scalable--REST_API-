import logger from '../utils/logger.js';
import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.userId
  });
  
  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  
  sendError(res, err, statusCode, message);
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
