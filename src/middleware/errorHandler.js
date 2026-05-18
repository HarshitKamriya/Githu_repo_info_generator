/**
 * Centralized Error Handler Middleware
 * Catches all errors forwarded via next(error) and sends a uniform JSON response.
 */

/**
 * Express error-handling middleware.
 * Must have 4 parameters to be recognized by Express as an error handler.
 */
function errorHandler(err, req, res, _next) {
  console.error(`❌ Error: ${err.message}`);

  // Determine status code from error message patterns
  let statusCode = 500;

  if (err.message.includes('required') || err.message.includes('Invalid')) {
    statusCode = 400; // Bad Request
  } else if (err.message.includes('not found')) {
    statusCode = 404; // Not Found
  } else if (err.message.includes('Authentication')) {
    statusCode = 401; // Unauthorized
  } else if (err.message.includes('rate limit')) {
    statusCode = 429; // Too Many Requests
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected error occurred.',
  });
}

module.exports = errorHandler;
