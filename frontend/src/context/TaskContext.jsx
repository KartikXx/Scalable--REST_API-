import React, { createContext, useReducer, useCallback } from 'react';

export const TaskContext = createContext();

const initialState = {
  tasks: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  selectedTask: null
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        tasks: action.payload.tasks,
        total: action.payload.total,
        page: action.payload.page,
        limit: action.payload.limit,
        isLoading: false
      };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'CREATE_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        total: state.total + 1
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
        total: state.total - 1
      };
    case 'SELECT_TASK':
      return { ...state, selectedTask: action.payload };
    case 'CLEAR_SELECTED':
      return { ...state, selectedTask: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const setLoading = useCallback((loading) => {
    dispatch({ type: loading ? 'FETCH_START' : 'FETCH_COMPLETE' });
  }, []);

  const setTasks = useCallback((tasks, total, page, limit) => {
    dispatch({
      type: 'FETCH_SUCCESS',
      payload: { tasks, total, page, limit }
    });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'FETCH_FAILURE', payload: error });
  }, []);

  const addTask = useCallback((task) => {
    dispatch({ type: 'CREATE_TASK', payload: task });
  }, []);

  const updateTask = useCallback((task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }, []);

  const removeTask = useCallback((taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  }, []);

  const selectTask = useCallback((task) => {
    dispatch({ type: 'SELECT_TASK', payload: task });
  }, []);

  const clearSelected = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTED' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    setLoading,
    setTasks,
    setError,
    addTask,
    updateTask,
    removeTask,
    selectTask,
    clearSelected,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
