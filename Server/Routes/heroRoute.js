const express = require('express');
const router = express.Router();
const heroController = require('../Controllers/heroController');
const { verifyToken } = require('../Middlewares/authMiddleware');

router.post('/', verifyToken, heroController.createHeroData);

// Public routes
router.get('/', heroController.getHeroData);

// Admin routes
router.put('/', verifyToken, heroController.updateHeroData);

module.exports = router;