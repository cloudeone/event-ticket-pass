const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, ticketController.listTickets);
router.get('/:id', authenticate, ticketController.getTicket);

module.exports = router;
