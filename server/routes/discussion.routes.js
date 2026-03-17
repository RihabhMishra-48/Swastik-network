const express = require('express');
const router = express.Router();
const { 
  createDiscussion, 
  getDiscussions, 
  voteDiscussion 
} = require('../controllers/discussion.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, createDiscussion);
router.get('/', protect, getDiscussions);
router.post('/:id/vote', protect, voteDiscussion);

module.exports = router;
