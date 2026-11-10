const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticate, authorize } = require('../middleware/auth');

// Public / Buyer access
router.get('/', eventController.listEvents);
router.get('/:id', eventController.getEvent);

// Admin only routes
router.post('/', authenticate, authorize('admin'), eventController.createEvent);
router.put('/:id', authenticate, authorize('admin'), eventController.updateEvent);
router.patch('/:id/activate', authenticate, authorize('admin'), eventController.activateEvent);
router.patch('/:id/archive', authenticate, authorize('admin'), eventController.archiveEvent);
router.delete('/:id', authenticate, authorize('admin'), eventController.deleteEvent);

module.exports = router;
