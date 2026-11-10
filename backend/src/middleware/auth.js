const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'event_ticket_pass_jwt_secret_dev_key_2026';

/**
 * Middleware untuk verifikasi JWT token
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Akses ditolak: Token autentikasi tidak ditemukan', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Sesi telah kedaluwarsa. Silakan login kembali.', 401);
    }
    return error(res, 'Token autentikasi tidak valid', 401);
  }
};

/**
 * Middleware untuk otorisasi berbasis peran (Role-Based Access Control)
 * @param  {...string} allowedRoles - Peran yang diizinkan ('buyer', 'staff', 'admin')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Pengguna belum terautentikasi', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Akses ditolak: Anda tidak memiliki izin untuk fitur ini', 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  JWT_SECRET,
};
