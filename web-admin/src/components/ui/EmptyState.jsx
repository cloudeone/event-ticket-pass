import React from 'react';
import { PackageOpen } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Tidak Ada Data',
  description = 'Belum ada data yang tersedia untuk ditampilkan saat ini.',
  action,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__icon-wrap">
        <Icon size={28} />
      </div>
      <h4 className="empty-state__title">{title}</h4>
      <p className="empty-state__description">{description}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
