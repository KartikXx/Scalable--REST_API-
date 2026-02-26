import { useState } from 'react';
import { TASK_PRIORITIES } from '../../utils/constants';
import { Alert, Button } from '../Common';

export const TaskForm = ({ task = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium'
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setError('');
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to save task');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      {error && <Alert type="error" message={error} />}
      
      <div className="form-group">
        <label className="form-label">{task ? 'Edit Task' : 'Add New Task'}</label>
      </div>

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          disabled={isLoading}
          maxLength="255"
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description (optional)"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={isLoading}
        >
          {Object.entries(TASK_PRIORITIES).map(([key, value]) => (
            <option key={key} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
