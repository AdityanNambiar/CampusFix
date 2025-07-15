const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Student creates a complaint
exports.createComplaint = async (req, res) => {
  const { title, description, category, location } = req.body;
  // Assign to maintenance user with least open/in progress complaints
  const maintUsers = await User.find({ role: 'Maintenance' });
  let assignedTo = undefined;
  if (maintUsers.length > 0) {
    // For each maintenance user, count their open/in progress complaints
    const counts = await Promise.all(
      maintUsers.map(async u => {
        const count = await Complaint.countDocuments({ assignedTo: u._id, status: { $in: ['open', 'in progress'] } });
        return { id: u._id, count };
      })
    );
    // Find the user with the minimum count
    const minUser = counts.reduce((min, curr) => curr.count < min.count ? curr : min, counts[0]);
    assignedTo = minUser.id;
  }
  const complaint = new Complaint({
    title,
    description,
    category,
    location,
    createdBy: req.user.id,
    assignedTo
  });
  await complaint.save();
  res.status(201).json({ message: 'Complaint created', complaint });
};

// Get complaints (filtered by role and query)
exports.getComplaints = async (req, res) => {
  let filter = {};
  // Students see their own, maintenance see assigned, admin see all
  if (req.user.role === 'Student') filter.createdBy = req.user.id;
  if (req.user.role === 'Maintenance') filter.assignedTo = req.user.id;
  // Query filters
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = { $regex: req.query.category, $options: 'i' };
  if (req.query.from && req.query.to) filter.createdAt = { $gte: new Date(req.query.from), $lte: new Date(req.query.to) };
  const complaints = await Complaint.find(filter).populate('assignedTo createdBy');
  res.json(complaints);
};

// Update complaint (status/remarks for maintenance, assign for admin)
exports.updateComplaint = async (req, res) => {
  const { id } = req.params;
  let update = req.body;
  // Admin can assign, maintenance can update status/remarks
  if (req.user.role === 'Admin' && update.assignedTo) update = { ...update, assignedTo: update.assignedTo };
  if (req.user.role === 'Maintenance') update = { status: update.status, remarks: update.remarks };
  const complaint = await Complaint.findByIdAndUpdate(id, update, { new: true });
  res.json({ message: 'Complaint updated', complaint });
}; 