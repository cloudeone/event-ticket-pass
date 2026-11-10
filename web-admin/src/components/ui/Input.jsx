import React, { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className = '',
    id,
    type = 'text',
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" size={18} />}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={`form-input ${Icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="form-error">{error}</span>
      ) : helperText ? (
        <span className="form-helper">{helperText}</span>
      ) : null}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, helperText, className = '', id, required = false, rows = 3, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className="form-input form-textarea"
        {...props}
      />
      {error ? (
        <span className="form-error">{error}</span>
      ) : helperText ? (
        <span className="form-helper">{helperText}</span>
      ) : null}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, helperText, options = [], className = '', id, required = false, children, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select ref={ref} id={inputId} className="form-input form-select" {...props}>
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
      {error ? (
        <span className="form-error">{error}</span>
      ) : helperText ? (
        <span className="form-helper">{helperText}</span>
      ) : null}
    </div>
  );
});

export default Input;
