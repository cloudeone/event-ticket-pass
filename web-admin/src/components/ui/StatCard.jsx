import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

export default function StatCard({
  label,
  value,
  subtitle,
  trend,
  trendLabel = 'vs periode lalu',
  icon: Icon,
  iconColor = 'indigo',
  badge,
  children,
  className = '',
  onClick,
}) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;
  const isNeutral = trend === 0 || trend === undefined || trend === null;

  return (
    <div
      className={`stat-card ${onClick ? 'stat-card--clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {Icon && (
          <div className={`stat-card__icon-wrap stat-card__icon-wrap--${iconColor}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-card__main">
        <div className="stat-card__value-row">
          <span className="stat-card__value tabular-nums">{value}</span>
          {badge && <span className="stat-card__badge">{badge}</span>}
        </div>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>

      {(trend !== undefined && trend !== null) && (
        <div className="stat-card__trend-row">
          <span
            className={`stat-card__trend ${
              isPositive
                ? 'stat-card__trend--positive'
                : isNegative
                ? 'stat-card__trend--negative'
                : 'stat-card__trend--neutral'
            }`}
          >
            {isPositive && <TrendingUp size={13} />}
            {isNegative && <TrendingDown size={13} />}
            {isNeutral && <Minus size={13} />}
            <span>
              {isPositive ? '+' : ''}
              {trend}%
            </span>
          </span>
          {trendLabel && <span className="stat-card__trend-label">{trendLabel}</span>}
        </div>
      )}

      {children && <div className="stat-card__extra">{children}</div>}
    </div>
  );
}
