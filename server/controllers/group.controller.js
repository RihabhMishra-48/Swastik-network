const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');

exports.createGroup = async (req, res) => {
  try {
    const { name, description, type, university, password } = req.body;
    
    let hashedPassword = null;
    if (type === 'private' && password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const group = await Group.create({
      name,
      description,
      type: type || 'public',
      university: university || 'GLA University',
      password: hashedPassword,
      admin: req.user._id
    });

    await GroupMember.create({
      group: group._id,
      user: req.user._id,
      role: 'admin'
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    // List groups accessible to the user
    // public, semi-public (if same university), or already a member
    const userGroups = await GroupMember.find({ user: req.user._id }).distinct('group');
    
    const groups = await Group.find({
      $or: [
        { type: 'public' },
        { type: 'semi-public', university: req.user.university },
        { _id: { $in: userGroups } }
      ]
    }).populate('admin', 'username');
    
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { password } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.type === 'private') {
      const isMatch = await bcrypt.compare(password, group.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid group password' });
    }

    if (group.type === 'semi-public' && group.university !== req.user.university) {
      return res.status(403).json({ message: 'Only students from this university can join' });
    }

    await GroupMember.findOneAndUpdate(
      { group: group._id, user: req.user._id },
      { role: 'member' },
      { upsert: true }
    );

    res.json({ message: 'Joined group successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.id })
      .populate('sender', 'username avatar university')
      .populate('replyTo')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.moderateUser = async (req, res) => {
  try {
    const { userId, action, reason } = req.body; // action: 'kick', 'ban'
    const groupId = req.params.id;

    const selfRole = await GroupMember.findOne({ group: groupId, user: req.user._id });
    if (!['admin', 'co-admin'].includes(selfRole?.role)) {
      return res.status(403).json({ message: 'Not authorized for moderation' });
    }

    if (action === 'kick') {
      await GroupMember.deleteOne({ group: groupId, user: userId });
      await Group.findByIdAndUpdate(groupId, {
        $push: { logs: { action: 'kick', performedBy: req.user._id, target: userId, details: reason } }
      });
    }

    res.json({ message: `User ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
