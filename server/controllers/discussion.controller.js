const DiscussionPost = require('../models/DiscussionPost');

exports.createDiscussion = async (req, res) => {
  try {
    const { title, content, tags, type } = req.body;
    const post = await DiscussionPost.create({
      author: req.user._id,
      title,
      content,
      tags,
      type
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const { type, tag } = req.query;
    let query = {};
    if (type) query.type = type;
    if (tag) query.tags = tag;

    const posts = await DiscussionPost.find(query)
      .populate('author', 'username avatar university')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.voteDiscussion = async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const hasVoted = post.voters.includes(req.user._id);
    if (hasVoted) {
      post.votes -= 1;
      post.voters = post.voters.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.votes += 1;
      post.voters.push(req.user._id);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
