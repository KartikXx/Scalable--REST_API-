import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

const SALT_ROUNDS = 12;

export const registerUser = async (email, password) => {
  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }
    
    // Hash password
    const passwordHash = await bcryptjs.hash(password, SALT_ROUNDS);
    
    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, passwordHash, 'user']
    );
    
    logger.info(`New user registered: ${email}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Find user by email
    const result = await query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
    
    const user = result.rows[0];
    
    // Compare passwords
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
    
    logger.info(`User logged in: ${email}`);
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
};

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiry }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiry }
  );
  
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }
};

export const getUserById = async (userId) => {
  try {
    const result = await query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    return result.rows[0];
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const result = await query(
      'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    return result.rows;
  } catch (error) {
    logger.error(`Get all users error: ${error.message}`);
    throw error;
  }
};
