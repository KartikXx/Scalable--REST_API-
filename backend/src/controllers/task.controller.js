import * as taskService from '../services/task.service.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.js';
import { PAGINATION } from '../config/constants.js';
import logger from '../utils/logger.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    const userId = req.user.userId;
    
    const task = await taskService.createTask(userId, title, description, priority);
    
    sendSuccess(res, task, 'Task created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getUserTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page || PAGINATION.DEFAULT_PAGE, 10);
    const limit = parseInt(req.query.limit || PAGINATION.DEFAULT_LIMIT, 10);
    
    // Validate and cap limit
    const validLimit = Math.min(limit, PAGINATION.MAX_LIMIT);
    
    const result = await taskService.getUserTasks(userId, page, validLimit);
    
    sendSuccess(res, result, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const task = await taskService.getTaskById(id, userId);
    
    sendSuccess(res, task, 'Task retrieved successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return sendNotFound(res, error.message);
    }
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;
    
    const task = await taskService.updateTask(id, userId, updates);
    
    sendSuccess(res, task, 'Task updated successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return sendNotFound(res, error.message);
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const result = await taskService.deleteTask(id, userId);
    
    sendSuccess(res, result, 'Task deleted successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return sendNotFound(res, error.message);
    }
    next(error);
  }
};

export const getTasksByStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;
    const page = parseInt(req.query.page || PAGINATION.DEFAULT_PAGE, 10);
    const limit = parseInt(req.query.limit || PAGINATION.DEFAULT_LIMIT, 10);
    
    if (!status) {
      return sendError(res, new Error('Status filter required'), 400, 'Status query parameter is required');
    }
    
    const validLimit = Math.min(limit, PAGINATION.MAX_LIMIT);
    const result = await taskService.getTasksByStatus(userId, status, page, validLimit);
    
    sendSuccess(res, result, 'Tasks filtered by status');
  } catch (error) {
    next(error);
  }
};

// Admin endpoints
export const getAllTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || PAGINATION.DEFAULT_PAGE, 10);
    const limit = parseInt(req.query.limit || PAGINATION.DEFAULT_LIMIT, 10);
    
    const validLimit = Math.min(limit, PAGINATION.MAX_LIMIT);
    const result = await taskService.getAllTasks(page, validLimit);
    
    sendSuccess(res, result, 'All tasks retrieved (admin view)');
  } catch (error) {
    next(error);
  }
};
