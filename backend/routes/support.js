const express = require('express');
const router = express.Router();
const SupportMessage = require('../models/SupportMessage');
const auth = require('../middleware/auth');

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required.' });
};

// POST /api/support - Submit a support message
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;
    const user = req.user ? req.user.id : undefined;
    const supportMessage = new SupportMessage({
      name,
      email,
      subject,
      message,
      category,
      user,
    });
    await supportMessage.save();
    res.status(201).json({ message: 'Support message submitted successfully.' });
  } catch (err) {
    console.error('Support message error:', err);
    res.status(500).json({ message: 'Failed to submit support message.' });
  }
});

// GET /api/support - Admin: Get all support messages
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch support messages.' });
  }
});

// PATCH /api/support/:id/status - Admin: Update status of a support message
router.patch('/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'in progress', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const message = await SupportMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Support message not found.' });
    }
    res.json(message);
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

module.exports = router; 