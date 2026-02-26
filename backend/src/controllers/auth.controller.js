import * as userService from '../services/user.service.js';
import { sendSuccess, sendError, sendUnauthorized } from '../utils/response.js';
import logger from '../utils/logger.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await userService.registerUser(email, password);
    
    sendSuccess(res, {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    }, 'User registered successfully', 201);
  } catch (error) {
    if (error.statusCode === 409) {
      return sendError(res, error, 409, error.message);
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await userService.loginUser(email, password);
    const { accessToken, refreshToken } = userService.generateTokens(user);
    
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    sendSuccess(res, {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }, 'Login successful');
  } catch (error) {
    if (error.statusCode === 401) {
      return sendUnauthorized(res, error.message);
    }
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return sendUnauthorized(res, 'Refresh token not provided');
    }
    
    const decoded = userService.verifyRefreshToken(refreshToken);
    
    // Get user details
    const user = await userService.getUserById(decoded.userId);
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = userService.generateTokens(user);
    
    // Update refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    logger.info(`Token refreshed for user: ${user.email}`);
    
    sendSuccess(res, {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }, 'Token refreshed successfully');
  } catch (error) {
    if (error.statusCode === 401) {
      return sendUnauthorized(res, error.message);
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    logger.info(`User logged out: ${req.user.email}`);
    
    sendSuccess(res, {}, 'Logout successful');
  } catch (error) {
    next(error);
  }
};
