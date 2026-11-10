const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth');
const { requireIdempotency } = require('../middleware/idempotency');

router.post('/:orderId/pay', authenticate, requireIdempotency, paymentController.simulatePayment);

module.exports = router;
