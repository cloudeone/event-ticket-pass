import React from 'react';
import './Card.css';

export function Card({ children, className = '', hoverable = false, padding = 'md', ...props }) {
  const classes = [
    'ui-card',
    hoverable ? 'ui-card-hover' : '',
    `ui-card-p-${padding}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`ui-card-header ${className}`}>
      <div>
        {title && <h3 className="ui-card-title">{title}</h3>}
        {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="ui-card-header-action">{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`ui-card-content ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`ui-card-footer ${className}`}>{children}</div>;
}

export default Card;
