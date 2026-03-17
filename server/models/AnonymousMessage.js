const mongoose = require('mongoose');

const anonymousMessageSchema = new mongoose.Schema({
  room: { type: String, default: 'global_anon' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('AnonymousMessage', anonymousMessageSchema);
