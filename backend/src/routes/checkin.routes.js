const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkin.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/validate', authenticate, authorize('staff', 'admin'), checkinController.validateCheckIn);
router.get('/events', authenticate, authorize('staff', 'admin'), checkinController.listEventsForCheckIn);

module.exports = router;
