const { v4: uuidv4 } = require('uuid');

/**
 * Format angka ke format Rupiah
 * @param {number} amount - Jumlah dalam integer
 * @returns {string} String format Rupiah
 */
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generate nomor order unik
 * Format: ORD-YYYYMMDD-XXXXXXXX
 * @returns {string} Nomor order
 */
const generateOrderNumber = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
  return `ORD-${dateStr}-${randomPart}`;
};

/**
 * Generate kode tiket unik
 * Format: TKT-XXXXXXXX-XXXX
 * @returns {string} Kode tiket
 */
const generateTicketCode = () => {
  const id = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
  return `TKT-${id.substring(0, 8)}-${id.substring(8)}`;
};

/**
 * Generate QR token unik (UUID v4)
 * @returns {string} QR token
 */
const generateQRToken = () => {
  return uuidv4();
};

module.exports = {
  formatRupiah,
  generateOrderNumber,
  generateTicketCode,
  generateQRToken,
};
