import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../utils/api';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/v1/auth/logout');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
      navigate('/login');
    }
  };

  return (
    <header style={{
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Task Manager
        </h1>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Logged in as</p>
              <p style={{ margin: 0, fontWeight: '500' }}>
                {user.email}
                {user.role === 'admin' && ' (Admin)'}
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
              style={{ color: '#374151' }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
