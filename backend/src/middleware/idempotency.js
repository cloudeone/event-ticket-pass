const { error } = require('../utils/response');

// Memory store for mock/fallback idempotency tracking in local mode
const idempotencyStore = new Map();

/**
 * Middleware idempotensi untuk mencegah duplikasi pesanan dan pembayaran
 * BR-PAY-007, BR-ORD-001, FR-PAY-003
 */
const requireIdempotency = (req, res, next) => {
  const idempotencyKey =
    req.headers['x-idempotency-key'] ||
    req.body.idempotency_key;

  if (!idempotencyKey) {
    return error(
      res,
      'Header X-Idempotency-Key atau body.idempotency_key wajib disertakan.',
      400
    );
  }

  req.idempotencyKey = idempotencyKey;

  // Check if already processed in memory
  if (idempotencyStore.has(idempotencyKey)) {
    const cached = idempotencyStore.get(idempotencyKey);
    return res.status(cached.status).json(cached.body);
  }

  // Intercept response to store result
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(idempotencyKey, {
        status: res.statusCode,
        body,
        timestamp: Date.now(),
      });
    }
    return originalJson(body);
  };

  next();
};

module.exports = {
  requireIdempotency,
  idempotencyStore,
};
