const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { verifyToken } = require('../Middlewares/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me',verifyToken ,authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;