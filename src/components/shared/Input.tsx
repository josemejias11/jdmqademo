import React, { ChangeEvent } from 'react';

interface InputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color';
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  required?: boolean;
}

/**
 * Reusable Input component
 */
const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  disabled = false,
  name,
  id,
  required = false
}) => {
  const baseClass = 'form-control';

  return (
    <input
      type={type}
      className={`${baseClass} ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      id={id}
      required={required}
    />
  );
};

export default Input;
