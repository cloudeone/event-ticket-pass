import React from 'react';
import './StatusBadge.css';

const STATUS_MAP = {
  // Active / Live
  aktif: { label: 'Aktif', variant: 'aktif' },
  live: { label: 'Live', variant: 'aktif' },
  berhasil: { label: 'Berhasil', variant: 'aktif' },
  dibayar: { label: 'Dibayar', variant: 'aktif' },
  sukses: { label: 'Sukses', variant: 'aktif' },
  valid: { label: 'Valid', variant: 'aktif' },
  online: { label: 'Online', variant: 'aktif' },

  // Pending / Waiting
  menunggu: { label: 'Menunggu', variant: 'menunggu' },
  menunggu_pembayaran: { label: 'Menunggu Pembayaran', variant: 'menunggu' },
  pending: { label: 'Pending', variant: 'menunggu' },
  proses: { label: 'Diproses', variant: 'menunggu' },

  // Draft / Inactive
  draft: { label: 'Draft', variant: 'draf' },
  draf: { label: 'Draf', variant: 'draf' },
  nonaktif: { label: 'Nonaktif', variant: 'draf' },
  offline: { label: 'Offline', variant: 'draf' },

  // Archived / Used
  diarsipkan: { label: 'Diarsipkan', variant: 'diarsipkan' },
  sudah_dipakai: { label: 'Sudah Dipakai', variant: 'diarsipkan' },
  selesai: { label: 'Selesai', variant: 'selesai' },

  // Warning / Sold Out
  sold_out: { label: 'Sold Out', variant: 'dibatalkan' },
  refund: { label: 'Refund', variant: 'diarsipkan' },

  // Cancelled / Failed / Expired
  dibatalkan: { label: 'Dibatalkan', variant: 'dibatalkan' },
  gagal: { label: 'Gagal', variant: 'dibatalkan' },
  tidak_valid: { label: 'Tidak Valid', variant: 'dibatalkan' },
  kedaluwarsa: { label: 'Kedaluwarsa', variant: 'kedaluwarsa' },
};

export default function StatusBadge({
  status,
  label,
  size = 'md',
  dot = true,
  className = '',
}) {
  const normalized = (status || '').toString().toLowerCase().trim().replace(/\s+/g, '_');
  const config = STATUS_MAP[normalized] || {
    label: status || 'Unknown',
    variant: 'draf',
  };

  const displayLabel = label || config.label;
  const variant = config.variant;

  return (
    <span
      className={`status-badge status-badge--${variant} status-badge--${size} ${className}`}
    >
      {dot && <span className="status-badge__dot" />}
      <span className="status-badge__text">{displayLabel}</span>
    </span>
  );
}
