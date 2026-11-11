import React from 'react';
import './Card.css';

export function Card({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  ...props
}) {
  const classNames = [
    'card',
    `card--pad-${padding}`,
    hoverable ? 'card--hoverable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon: Icon,
  className = '',
  children,
}) {
  return (
    <div className={`card__header ${className}`}>
      <div className="card__header-main">
        {Icon && <Icon className="card__header-icon" size={20} />}
        <div>
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="card__header-action">{action}</div>}
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`card__content ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`card__footer ${className}`}>{children}</div>;
}

export default Card;
