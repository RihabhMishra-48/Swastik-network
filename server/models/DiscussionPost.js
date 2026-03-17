const mongoose = require('mongoose');

const discussionPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  type: { 
    type: String, 
    enum: ['idea', 'achievement', 'technical_question', 'opinion'], 
    required: true 
  },
  votes: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('DiscussionPost', discussionPostSchema);
