const mongoose = require('mongoose');

// Complaint schema for maintenance issues
const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['open', 'in progress', 'resolved'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  escalationFlag: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema); 