import { sendForbidden } from '../utils/response.js';

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendForbidden(res, 'Authentication required');
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return sendForbidden(res, 'You do not have permission to access this resource');
    }
    
    next();
  };
};

export const isOwner = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.userId !== resourceUserId && req.user.role !== 'admin') {
      return sendForbidden(res, 'You do not have permission to modify this resource');
    }
    
    next();
  };
};
