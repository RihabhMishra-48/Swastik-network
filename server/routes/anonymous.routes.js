const express = require('express');
const router = express.Router();
const { getAnonymousMessages, postAnonymousMessage } = require('../controllers/anonymous.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAnonymousMessages);
router.post('/', protect, postAnonymousMessage);

module.exports = router;
