import React from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
  className?: string;
  onClose?: () => void;
}

/**
 * Reusable Alert component for displaying messages
 */
const Alert: React.FC<AlertProps> = ({
  message,
  type = 'info',
  className = '',
  onClose
}) => {
  if (!message) return null;
  
  const baseClass = 'alert';
  const typeClass = `alert-${type}`;
  const dismissibleClass = onClose ? 'alert-dismissible fade show' : '';
  
  return (
    <div 
      className={`${baseClass} ${typeClass} ${dismissibleClass} ${className}`} 
      role="alert"
    >
      {message}
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default Alert;