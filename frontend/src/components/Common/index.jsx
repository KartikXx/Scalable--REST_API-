export const Loading = ({ message = 'Loading...' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding: '2rem' }}>
    <div className="spinner"></div>
    <span style={{ marginLeft: '1rem' }}>{message}</span>
  </div>
);

export const Alert = ({ type = 'info', message, onClose }) => (
  <div className={`alert alert-${type}`}>
    <span>{message}</span>
    {onClose && <button className="btn-icon" onClick={onClose}>✕</button>}
  </div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const className = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''}`;
  
  return (
    <button 
      className={className}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          <span style={{ marginLeft: '0.5rem' }}>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
