const mongoose = require('mongoose');

const SupportMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'in progress', 'closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', SupportMessageSchema); 