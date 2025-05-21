const express = require('express');
const { getDashboardStats } = require('../Controllers/statsController');
const { verifyToken, checkRole } = require('../Middlewares/authMiddleware');

const router = express.Router();

router.get(
  '/dashboard',
  verifyToken, 
  checkRole(['admin']), 
  getDashboardStats
);

module.exports = router;