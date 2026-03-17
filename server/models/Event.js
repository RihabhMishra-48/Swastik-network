const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  registrationLink: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ticketInfo: String
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
