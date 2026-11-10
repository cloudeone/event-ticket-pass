const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin'), staffController.listStaff);
router.post('/', authenticate, authorize('admin'), staffController.createStaff);
router.patch('/:id/toggle', authenticate, authorize('admin'), staffController.toggleStaffStatus);

module.exports = router;
