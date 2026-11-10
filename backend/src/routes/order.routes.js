const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth');
const { requireIdempotency } = require('../middleware/idempotency');

router.post('/', authenticate, requireIdempotency, orderController.createOrder);
router.get('/', authenticate, orderController.listOrders);
router.get('/:id', authenticate, orderController.getOrder);
router.patch('/:id/cancel', authenticate, orderController.cancelOrder);

module.exports = router;
