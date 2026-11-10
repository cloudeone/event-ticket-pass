const { error } = require('../utils/response');

/**
 * Validasi input request body sederhana
 * @param {Array<{ field: string, required?: boolean, type?: string, min?: number, max?: number, custom?: (val) => boolean|string }>} rules
 */
const validate = (rules) => {
  return (req, res, next) => {
    const details = {};

    for (const rule of rules) {
      const val = req.body[rule.field];

      if (rule.required && (val === undefined || val === null || val === '')) {
        details[rule.field] = `${rule.field} wajib diisi.`;
        continue;
      }

      if (val !== undefined && val !== null && val !== '') {
        if (rule.type === 'number' && typeof val !== 'number') {
          details[rule.field] = `${rule.field} harus berupa angka.`;
        }

        if (rule.min !== undefined && val < rule.min) {
          details[rule.field] = `${rule.field} minimal bernilai ${rule.min}.`;
        }

        if (rule.max !== undefined && val > rule.max) {
          details[rule.field] = `${rule.field} maksimal bernilai ${rule.max}.`;
        }

        if (rule.custom) {
          const customErr = rule.custom(val, req.body);
          if (customErr) {
            details[rule.field] = customErr;
          }
        }
      }
    }

    if (Object.keys(details).length > 0) {
      return error(res, 'Validasi data gagal', 400, details);
    }

    next();
  };
};

module.exports = { validate };
