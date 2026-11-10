import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',         // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    loading ? 'btn-loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true" />
      )}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="btn-icon btn-icon-left" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      <span className="btn-text">{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="btn-icon btn-icon-right" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
    </button>
  );
}
