import { STATUS_LABELS, PRIORITY_LABELS, TASK_STATUSES } from '../../utils/constants';
import { Button } from '../Common';

export const TaskItem = ({ task, onEdit, onDelete, onStatusChange, isDeleting = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed':
        return '#ecf0ff';
      case 'in_progress':
        return '#fff9e6';
      case 'pending':
      default:
        return '#f0f9ff';
    }
  };

  return (
    <div className="card" style={{
      marginBottom: '1rem',
      backgroundColor: getStatusBgColor(task.status),
      borderLeft: `4px solid ${getPriorityColor(task.priority)}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            color: task.status === 'completed' ? '#9ca3af' : 'inherit'
          }}>
            {task.title}
          </h3>
          {task.description && (
            <p style={{
              margin: '0.5rem 0',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              {task.description}
            </p>
          )}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            <span>
              Priority: <strong style={{ color: getPriorityColor(task.priority) }}>
                {PRIORITY_LABELS[task.priority]}
              </strong>
            </span>
            <span>Status: <strong>{STATUS_LABELS[task.status]}</strong></span>
            {task.created_at && (
              <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          minWidth: '180px'
        }}>
          {task.status !== 'completed' && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              style={{ padding: '0.5rem', fontSize: '0.875rem' }}
            >
              <option value={TASK_STATUSES.PENDING}>Pending</option>
              <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUSES.COMPLETED}>Completed</option>
            </select>
          )}
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(task)}
              style={{ flex: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task.id)}
              loading={isDeleting}
              disabled={isDeleting}
              style={{ flex: 1 }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
