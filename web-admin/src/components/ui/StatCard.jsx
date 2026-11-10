import React from 'react';
import './StatCard.css';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend, // { type: 'up' | 'down' | 'neutral', text: string }
  className = '',
}) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon-wrapper">
            <Icon size={20} className="stat-card-icon" />
          </div>
        )}
      </div>

      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {(subtext || trend) && (
          <div className="stat-card-footer">
            {trend && (
              <span className={`stat-card-trend trend-${trend.type}`}>
                {trend.type === 'up' ? '↑' : trend.type === 'down' ? '↓' : '•'} {trend.text}
              </span>
            )}
            {subtext && <span className="stat-card-subtext">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
