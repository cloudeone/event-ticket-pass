import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'indigo',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`progress-bar-wrap ${className}`}>
      {(showLabel || label) && (
        <div className="progress-bar-wrap__label-row">
          {label && <span className="progress-bar-wrap__label">{label}</span>}
          {showLabel && (
            <span className="progress-bar-wrap__percentage tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`progress-bar progress-bar--${size}`}>
        <div
          className={`progress-bar__fill progress-bar__fill--${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

