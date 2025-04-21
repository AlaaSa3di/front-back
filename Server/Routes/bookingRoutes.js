const express = require('express');
const bookingController = require('../Controllers/bookingController');
const authController = require('../Controllers/authController');
const { verifyToken } = require('../Middlewares/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post(
  '/',
  bookingController.uploadDesign,
  bookingController.createBooking
);

router.get(
  '/',
  verifyToken,bookingController.getAllBookings
);

router.get(
  '/:id',
  bookingController.getBooking
);

// Restrict to admin only
router.use(authController.restrictTo('admin'));
router.patch('/:id', verifyToken, bookingController.updateBooking); // نقطة النهاية الجديدة

router.patch(
  '/:id/status',
  bookingController.updateBookingStatus
);

router.delete(
  '/:id',
  bookingController.deleteBooking
);

module.exports = router;