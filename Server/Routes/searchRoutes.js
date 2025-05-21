const express = require('express');
const router = express.Router();
const searchController = require('../Controllers/searchController');
const rateLimit = require('express-rate-limit');

const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many search requests, please try again later"
  }
});

router.get('/screens', searchLimiter, searchController.searchScreens);

module.exports = router;