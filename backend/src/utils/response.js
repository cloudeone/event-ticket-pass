/**
 * Standardized API Response Helper
 * Menyediakan format response yang konsisten untuk seluruh API
 */

/**
 * Response sukses
 * @param {import('express').Response} res - Express response object
 * @param {*} data - Data response
 * @param {string} message - Pesan sukses
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, data = null, message = 'Berhasil', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Response error
 * @param {import('express').Response} res - Express response object
 * @param {string} message - Pesan error
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} details - Detail error tambahan
 */
const error = (res, message = 'Terjadi kesalahan server', statusCode = 500, details = null) => {
  const response = {
    success: false,
    message,
  };

  if (details !== null && details !== undefined) {
    response.errors = details;
  }

  return res.status(statusCode).json(response);
};

/**
 * Response sukses dengan pagination
 * @param {import('express').Response} res - Express response object
 * @param {Array} data - Data array
 * @param {number} page - Halaman saat ini
 * @param {number} limit - Jumlah item per halaman
 * @param {number} total - Total item keseluruhan
 */
const paginated = (res, data, page, limit, total) => {
  return res.status(200).json({
    success: true,
    message: 'Berhasil',
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      totalPages: Math.ceil(total / limit),
    },
  });
};

module.exports = { success, error, paginated };
