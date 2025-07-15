const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middlewares/auth');

router.get('/unresolved-pdf', auth('Admin'), reportController.getUnresolvedReport);

module.exports = router; 