import { query } from '../config/database.js';
import logger from '../utils/logger.js';
import { PAGINATION } from '../config/constants.js';

export const createTask = async (userId, title, description, priority = 'medium') => {
  try {
    const result = await query(
      'INSERT INTO tasks (user_id, title, description, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, description, priority]
    );
    
    logger.info(`Task created: ${result.rows[0].id} for user ${userId}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Create task error: ${error.message}`);
    throw error;
  }
};

export const getUserTasks = async (userId, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
  try {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM tasks WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count, 10);
    
    // Get paginated results
    const result = await query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    
    return {
      tasks: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Get user tasks error: ${error.message}`);
    throw error;
  }
};

export const getTaskById = async (taskId, userId = null) => {
  try {
    let queryText = 'SELECT * FROM tasks WHERE id = $1';
    let params = [taskId];
    
    // If userId is provided, only return if it belongs to that user (unless they're admin)
    if (userId) {
      queryText += ' AND user_id = $2';
      params.push(userId);
    }
    
    const result = await query(queryText, params);
    
    if (result.rows.length === 0) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    
    return result.rows[0];
  } catch (error) {
    logger.error(`Get task error: ${error.message}`);
    throw error;
  }
};

export const updateTask = async (taskId, userId, updates) => {
  try {
    // Verify task exists and belongs to user
    const task = await getTaskById(taskId, userId);
    
    // Build dynamic update query
    const allowedFields = ['title', 'description', 'status', 'priority'];
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        updateValues.push(updates[field]);
        paramIndex++;
      }
    });
    
    if (updateFields.length === 0) {
      return task; // No updates provided, return existing task
    }
    
    updateFields.push(`updated_at = $${paramIndex}`);
    updateValues.push(new Date());
    paramIndex++;
    
    updateValues.push(taskId);
    
    const queryText = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await query(queryText, updateValues);
    
    logger.info(`Task updated: ${taskId}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Update task error: ${error.message}`);
    throw error;
  }
};

export const deleteTask = async (taskId, userId) => {
  try {
    // Verify task exists and belongs to user
    await getTaskById(taskId, userId);
    
    await query('DELETE FROM tasks WHERE id = $1', [taskId]);
    
    logger.info(`Task deleted: ${taskId}`);
    return { message: 'Task deleted successfully' };
  } catch (error) {
    logger.error(`Delete task error: ${error.message}`);
    throw error;
  }
};

export const getAllTasks = async (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
  try {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM tasks');
    const total = parseInt(countResult.rows[0].count, 10);
    
    // Get paginated results with user info
    const result = await query(
      `SELECT t.*, u.email as user_email FROM tasks t 
       JOIN users u ON t.user_id = u.id 
       ORDER BY t.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    return {
      tasks: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Get all tasks error: ${error.message}`);
    throw error;
  }
};

export const getTasksByStatus = async (userId, status, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
  try {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status = $2',
      [userId, status]
    );
    const total = parseInt(countResult.rows[0].count, 10);
    
    // Get paginated results
    const result = await query(
      'SELECT * FROM tasks WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4',
      [userId, status, limit, offset]
    );
    
    return {
      tasks: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Get tasks by status error: ${error.message}`);
    throw error;
  }
};
