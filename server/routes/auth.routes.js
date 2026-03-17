const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
