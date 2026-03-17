const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, registrationLink } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      registrationLink,
      organizer: req.user._id
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'username')
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.attendees.includes(req.user._id)) {
      event.attendees = event.attendees.filter(id => id.toString() !== req.user._id.toString());
    } else {
      event.attendees.push(req.user._id);
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
