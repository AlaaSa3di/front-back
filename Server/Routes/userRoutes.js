// const express = require("express");
// const router = express.Router();
// const { details } = require("../Controllers/userController.js");

// router.get("/details/:id", details);

// module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const bookingController = require('../Controllers/bookingController');
const { verifyToken, checkRole } = require('../Middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${req.user.id}-${Date.now()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only images are allowed!'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Apply authentication middleware to all user routes
router.use(verifyToken);

// Get current user profile with bookings
router.get('/profile', userController.getUserProfile);

// Update user profile with optional picture upload
router.put('/profile', upload.single('profilePicture'), userController.updateUserProfile);

// Admin-only routes
router.get('/', checkRole(['admin']), userController.getAllUsers);

// User management routes
router.delete('/', userController.deleteUser);

module.exports = router;