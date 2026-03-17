const User = require('../models/User');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Follow = require('../models/Follow');
const FriendRequest = require('../models/FriendRequest');
const Notification = require('../models/Notification');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('friends', 'username avatar');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const followerId = req.user._id;

    if (targetId === followerId.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({ follower: followerId, following: targetId });
    if (existingFollow) {
      await Follow.deleteOne({ _id: existingFollow._id });
      await User.findByIdAndUpdate(targetId, { $pull: { followers: followerId } });
      return res.json({ message: 'Unfollowed successfully' });
    }

    await Follow.create({ follower: followerId, following: targetId });
    await User.findByIdAndUpdate(targetId, { $push: { followers: followerId } });

    // Create notification
    await Notification.create({
      user: targetId,
      type: 'post_like', // Reusing placeholder or should add 'follow' type
      data: { fromUser: followerId, text: `${req.user.username} followed you` }
    });

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const toId = req.params.id;
    const fromId = req.user._id;

    if (toId === fromId.toString()) return res.status(400).json({ message: 'Cannot friend yourself' });

    const existingRequest = await FriendRequest.findOne({ from: fromId, to: toId });
    if (existingRequest) return res.status(400).json({ message: 'Request already sent' });

    await FriendRequest.create({ from: fromId, to: toId });

    await Notification.create({
      user: toId,
      type: 'friend_request',
      data: { fromUser: fromId, text: `${req.user.username} sent you a friend request` }
    });

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.handleFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: 'accept' or 'decline'
    const request = await FriendRequest.findById(requestId);

    if (!request || request.to.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (action === 'accept') {
      request.status = 'accepted';
      await request.save();

      // Add to friends lists
      await User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } });
      await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } });

      await Notification.create({
        user: request.from,
        type: 'friend_request',
        data: { fromUser: req.user._id, text: `${req.user.username} accepted your friend request` }
      });
    } else {
      await FriendRequest.deleteOne({ _id: requestId });
    }

    res.json({ message: `Request ${action}ed` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('username avatar university').limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
