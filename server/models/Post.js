const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  shares: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
