import { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useAuth';
import apiClient from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/constants';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { Alert, Loading } from '../Common';

export const TaskList = ({ userId }) => {
  const {
    tasks,
    total,
    page,
    limit,
    isLoading,
    error,
    setTasks,
    setLoading,
    setError,
    addTask,
    updateTask,
    removeTask
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch tasks on component mount and when page changes
  useEffect(() => {
    fetchTasks();
  }, [page]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${API_ENDPOINTS.TASKS.LIST}?page=${page}&limit=${limit}`);
      const data = response.data.data;
      setTasks(data.tasks, data.total, data.page, limit);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, formData);
      addTask(response.data.data);
      setShowForm(false);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, formData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.TASKS.UPDATE(taskId),
        formData
      );
      updateTask(response.data.data);
      setEditingTask(null);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setDeletingId(taskId);
      await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(taskId));
      removeTask(taskId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.TASKS.UPDATE(taskId),
        { status: newStatus }
      );
      updateTask(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task status');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2>My Tasks</h2>
        {!showForm && !editingTask && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Task
          </button>
        )}
      </div>

      {error && <Alert type="error" message={error} />}

      {(showForm || editingTask) && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#f9fafb' }}>
          <TaskForm
            task={editingTask}
            onSubmit={editingTask
              ? async (data) => handleUpdateTask(editingTask.id, data)
              : handleCreateTask
            }
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            isLoading={isLoading}
          />
        </div>
      )}

      {isLoading && !tasks.length && <Loading />}

      {tasks.length === 0 && !isLoading && (
        <Alert type="info" message="No tasks found. Create one to get started!" />
      )}

      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          isDeleting={deletingId === task.id}
        />
      ))}

      {totalPages > 1 && (
        <div className="pagination">
          {page > 1 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => window.history.back()}
            >
              Previous
            </button>
          )}
          <span style={{ alignSelf: 'center', padding: '0.5rem' }}>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <button className="btn btn-secondary btn-sm" disabled>
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};
