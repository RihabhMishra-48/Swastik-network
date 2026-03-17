const AnonymousMessage = require('../models/AnonymousMessage');

exports.getAnonymousMessages = async (req, res) => {
  try {
    const messages = await AnonymousMessage.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postAnonymousMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const msg = await AnonymousMessage.create({ content });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
