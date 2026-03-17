const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getFeed, 
  likePost, 
  addComment, 
  getPostComments 
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('image'), createPost);
router.get('/feed', protect, getFeed);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.get('/:id/comments', protect, getPostComments);

module.exports = router;
