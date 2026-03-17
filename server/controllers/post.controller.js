const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

exports.createPost = async (req, res) => {
  try {
    const { content, visibility } = req.body;
    let images = [];
    if (req.file) images.push(req.file.path);

    const post = await Post.create({
      author: req.user._id,
      content,
      images,
      visibility: visibility || 'public'
    });

    const populated = await post.populate('author', 'username avatar university');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Feed logic: 
    // 1. All public posts
    // 2. Private posts from users being followed
    const followedUsers = await User.findById(req.user._id).select('followers'); // Wait, should be 'following' in a real Follow model but here we used 'followers' in user model for simplicity, let's fix logic.
    // Actually our Follow model is better.
    const Follow = require('../models/Follow');
    const following = await Follow.find({ follower: req.user._id }).distinct('following');

    const posts = await Post.find({
      $or: [
        { visibility: 'public' },
        { author: { $in: [...following, req.user._id] } }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'username avatar university');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
      
      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: post.author,
          type: 'post_like',
          data: { fromUser: req.user._id, postId: post._id, text: `${req.user.username} liked your post` }
        });
      }
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      post: req.params.id,
      author: req.user._id,
      content
    });

    const post = await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } }, { new: true });

    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'post_comment',
        data: { fromUser: req.user._id, postId: post._id, text: `${req.user.username} commented on your post` }
      });
    }

    const populatedComment = await comment.populate('author', 'username avatar');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
