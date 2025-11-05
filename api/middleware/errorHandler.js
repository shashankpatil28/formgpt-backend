// File: formgpt-backend/api/middleware/errorHandler.js
/**
 * Global error handler middleware.
 * This catches all errors passed by next(error)
 */
export function errorHandler(err, req, res, next) {
  console.error('--- Global Error Handler ---');
  console.error(err.stack);
  console.error('-----------------------------');

  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    message: message,
    // Only include stack in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}