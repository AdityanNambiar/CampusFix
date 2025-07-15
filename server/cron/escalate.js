const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendEscalationEmail } = require('../utils/email');

// Escalate complaints older than 48 hours and email admin
const escalateComplaints = async () => {
  const now = new Date();
  const threshold = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  // Find unresolved, un-escalated complaints older than 48h
  const complaints = await Complaint.find({ status: { $ne: 'resolved' }, escalationFlag: false, createdAt: { $lt: threshold } });
  if (complaints.length === 0) return;
  const admin = await User.findOne({ role: 'Admin' });
  for (const c of complaints) {
    c.escalationFlag = true;
    await c.save();
    if (admin) {
      await sendEscalationEmail(admin.email, 'Complaint Escalation', `Complaint "${c.title}" has been escalated.`);
    }
  }
};

// Run every hour
const startEscalationCron = () => {
  cron.schedule('0 * * * *', escalateComplaints);
};

module.exports = { startEscalationCron }; 