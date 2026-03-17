const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateProfile, 
  followUser, 
  sendFriendRequest, 
  handleFriendRequest,
  searchUsers
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserProfile);
router.put('/update', protect, upload.single('avatar'), updateProfile);
router.post('/:id/follow', protect, followUser);
router.post('/:id/friend-request', protect, sendFriendRequest);
router.put('/friend-request', protect, handleFriendRequest);

module.exports = router;
