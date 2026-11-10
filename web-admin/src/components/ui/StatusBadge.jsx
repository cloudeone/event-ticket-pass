import React from 'react';
import './StatusBadge.css';

export default function StatusBadge({ status, type = 'auto', className = '' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  let variant = 'default';
  let label = normalized;

  // Event statuses
  if (normalized === 'AKTIF' || normalized === 'ACTIVE') {
    variant = 'success';
    label = 'Aktif';
  } else if (normalized === 'DRAF' || normalized === 'DRAFT') {
    variant = 'neutral';
    label = 'Draf';
  } else if (normalized === 'DIARSIPKAN' || normalized === 'ARCHIVED') {
    variant = 'warning';
    label = 'Diarsipkan';
  }

  // Order statuses
  else if (normalized === 'MENUNGGU_PEMBAYARAN' || normalized === 'WAITING_PAYMENT') {
    variant = 'info';
    label = 'Menunggu Pembayaran';
  } else if (normalized === 'DIBAYAR' || normalized === 'PAID') {
    variant = 'success';
    label = 'Dibayar';
  } else if (normalized === 'DIBATALKAN' || normalized === 'CANCELLED') {
    variant = 'danger';
    label = 'Dibatalkan';
  } else if (normalized === 'KEDALUWARSA' || normalized === 'EXPIRED') {
    variant = 'neutral';
    label = 'Kedaluwarsa';
  }

  // Ticket statuses & check-in
  else if (normalized === 'VALID') {
    variant = 'success';
    label = 'Valid';
  } else if (normalized === 'SUDAH_DIPAKAI' || normalized === 'USED') {
    variant = 'warning';
    label = 'Sudah Dipakai';
  } else if (normalized === 'TIDAK_VALID') {
    variant = 'danger';
    label = 'Tidak Valid';
  }

  // Generic boolean active/inactive
  else if (status === true || normalized === 'TRUE') {
    variant = 'success';
    label = 'Aktif';
  } else if (status === false || normalized === 'FALSE') {
    variant = 'neutral';
    label = 'Nonaktif';
  }

  return (
    <span className={`status-badge status-badge-${variant} ${className}`}>
      <span className="status-badge-dot" />
      <span className="status-badge-text">{label}</span>
    </span>
  );
}
