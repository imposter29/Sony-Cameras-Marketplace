const ContactMessage = require('../models/ContactMessage.model');

// @route   POST /api/contact
// @desc    Submit a contact message (public)
exports.submit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }
    const msg = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message received. We will get back to you shortly.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/contact  (admin only)
// @desc    Get all contact messages
exports.getAll = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/contact/:id/read  (admin only)
// @desc    Mark a message as read
exports.markRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/contact/:id  (admin only)
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
