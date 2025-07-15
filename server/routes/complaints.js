const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middlewares/auth');

// POST /complaints
router.post('/', auth('Student'), complaintController.createComplaint);

// GET /complaints
router.get('/', auth(), complaintController.getComplaints);

// PUT /complaints/:id
router.put('/:id', auth(['Maintenance', 'Admin']), complaintController.updateComplaint);

module.exports = router; 