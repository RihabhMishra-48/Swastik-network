const express = require('express');
const router = express.Router();
const { 
  createGroup, 
  getGroups, 
  joinGroup, 
  getGroupMessages, 
  moderateUser 
} = require('../controllers/group.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, createGroup);
router.get('/', protect, getGroups);
router.post('/:id/join', protect, joinGroup);
router.get('/:id/messages', protect, getGroupMessages);
router.post('/:id/moderate', protect, moderateUser);

module.exports = router;
