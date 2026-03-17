const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['friend_request', 'post_like', 'post_comment', 'event_announcement', 'group_invite'], required: true },
  data: {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    text: String
  },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
