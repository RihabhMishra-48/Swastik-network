const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['public', 'private', 'semi-public'], default: 'public' },
  university: { type: String, default: 'GLA University' },
  password: { type: String }, // For private groups
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  membersCount: { type: Number, default: 0 },
  logs: [{
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
