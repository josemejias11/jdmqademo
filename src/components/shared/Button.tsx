import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
}

/**
 * Reusable Button component
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'primary'
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;

  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
