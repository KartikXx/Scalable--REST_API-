export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data
  });
};

export const sendError = (res, error, statusCode = 500, message = 'Internal server error') => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    error: message,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

export const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    statusCode: 400,
    error: 'Validation error',
    details: errors
  });
};

export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    statusCode: 401,
    error: message
  });
};

export const sendForbidden = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    statusCode: 403,
    error: message
  });
};

export const sendNotFound = (res, message = 'Not found') => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    error: message
  });
};
