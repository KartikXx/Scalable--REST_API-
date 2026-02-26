export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout'
  },
  TASKS: {
    LIST: '/api/v1/tasks',
    CREATE: '/api/v1/tasks',
    GET: (id) => `/api/v1/tasks/${id}`,
    UPDATE: (id) => `/api/v1/tasks/${id}`,
    DELETE: (id) => `/api/v1/tasks/${id}`
  },
  ADMIN: {
    ALL_TASKS: '/api/v1/tasks/admin/all'
  }
};

export const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed'
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};
