const express = require('express');
const router = express.Router();
const { createEvent, getEvents, registerForEvent } = require('../controllers/event.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, createEvent);
router.get('/', protect, getEvents);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;
