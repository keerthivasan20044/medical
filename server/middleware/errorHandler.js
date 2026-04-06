export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the full error on server side
  console.error(`[${new Date().toISOString()}] Error:`, err);
  
  // Return sanitized error to client
  const response = {
    message: statusCode === 500 ? 'Internal server error' : (err.message || 'An error occurred'),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  res.status(statusCode).json(response);
}
