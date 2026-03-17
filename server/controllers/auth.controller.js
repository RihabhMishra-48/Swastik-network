const User = require('../models/User');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../config/mailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    user = await User.create({
      username,
      email,
      password,
      verificationToken
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (err) {
      console.error('Email error:', err);
      // Don't fail signup if email fails in dev, but in prod you might want to
    }

    res.status(201).json({ 
      message: 'Signup successful! Please check your email to verify your account.',
      userId: user._id 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Missing token' });

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Automatic Group Enrollment
    // 1. Welcome Group (search by name, or create if doesn't exist)
    let welcomeGroup = await Group.findOne({ name: 'Welcome Group' });
    if (!welcomeGroup) {
      // Create system/admin account for first group
      welcomeGroup = await Group.create({
        name: 'Welcome Group',
        description: 'Global chat for all Swastik users.',
        type: 'public',
        admin: user._id // Temporarily making the first verified user admin
      });
    }

    await GroupMember.findOneAndUpdate(
      { group: welcomeGroup._id, user: user._id },
      { role: 'member' },
      { upsert: true }
    );

    // 2. GLA University Group
    if (user.email.endsWith('@gla.ac.in')) {
      let universityGroup = await Group.findOne({ name: 'GLA University Group' });
      if (!universityGroup) {
        universityGroup = await Group.create({
          name: 'GLA University Group',
          description: 'Official group for GLA University students.',
          type: 'semi-public',
          university: 'GLA University',
          admin: user._id
        });
      }
      await GroupMember.findOneAndUpdate(
        { group: universityGroup._id, user: user._id },
        { role: 'member' },
        { upsert: true }
      );
    }

    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
