/**
 * Formatting utilities for TicketPass Ops Console (Web Admin)
 */

export function formatRupiah(amount) {
  if (amount === undefined || amount === null) return 'Rp 0';
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

export const formatCurrency = formatRupiah;

export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString('id-ID');
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const date = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${date} • ${time} WIB`;
}

export function formatPercent(value) {
  if (value === undefined || value === null) return '0%';
  return `${Number(value).toFixed(1)}%`;
}

export function formatCompactCurrency(amount) {
  if (amount === undefined || amount === null) return 'Rp 0';
  const num = Number(amount);
  if (num >= 1_000_000_000) {
    return 'Rp ' + (num / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' M';
  }
  if (num >= 1_000_000) {
    return 'Rp ' + (num / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' Jt';
  }
  if (num >= 1_000) {
    return 'Rp ' + (num / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 0 }) + ' Rb';
  }
  return 'Rp ' + num.toLocaleString('id-ID');
}

export function getRelativeTime(timestamp) {
  if (!timestamp) return '';
  const now = Date.now();
  const time = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
  const diffSec = Math.floor((now - time) / 1000);

  if (diffSec < 60) return `${Math.max(1, diffSec)} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} hari lalu`;
}
