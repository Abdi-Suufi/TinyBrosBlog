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

module.exports = router; 