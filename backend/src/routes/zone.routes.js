const express = require('express');
const router = express.Router({ mergeParams: true });
const zoneController = require('../controllers/zone.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/:eventId/zones', zoneController.listZones);
router.post('/:eventId/zones', authenticate, authorize('admin'), zoneController.createZone);
router.put('/zones/:id', authenticate, authorize('admin'), zoneController.updateZone);
router.delete('/zones/:id', authenticate, authorize('admin'), zoneController.deleteZone);

module.exports = router;
