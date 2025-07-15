const Complaint = require('../models/Complaint');
const { generateUnresolvedReport } = require('../utils/pdf');
const path = require('path');

exports.getUnresolvedReport = async (req, res) => {
  try {
    let filter = {};
    let statusFilter = undefined;
    if (req.query.status === 'open' || req.query.status === 'in progress' || req.query.status === 'resolved') {
      filter.status = req.query.status;
      statusFilter = req.query.status;
    } else {
      filter.status = { $ne: 'resolved' };
    }
    const complaints = await Complaint.find(filter);
    const filePath = path.join(__dirname, '../unresolved_report.pdf');
    await generateUnresolvedReport(complaints, filePath, statusFilter);
    res.download(filePath, 'unresolved_report.pdf');
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report' });
  }
}; 