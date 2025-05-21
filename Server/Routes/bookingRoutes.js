const express = require('express');
const bookingController = require('../Controllers/bookingController');
const paymentsController = require('../Controllers/paymentsController');
const authController = require('../Controllers/authController');
const { verifyToken } = require('../Middlewares/authMiddleware');

const router = express.Router();

router.use(authController.protect);

router.post(
  '/',
  bookingController.uploadDesign,
  bookingController.createBooking
);

router.get(
  '/',
  verifyToken,
  bookingController.getAllBookings
);

router.get(
  '/:id',
  bookingController.getBooking
);

router.post(
  '/:bookingId/create-payment',
  paymentsController.createPayPalOrder
);

router.post(
  '/:bookingId/capture-payment',
  paymentsController.capturePayPalPayment
);

router.use(authController.restrictTo('admin'));

router.patch(
  '/:id/status',
  bookingController.updateBookingStatus
);

router.patch(
  '/:id/approve',
  bookingController.approveBooking
);

router.patch(
  '/:id/reject',
  bookingController.rejectBooking
);

router.patch(
  '/:id/complete',
  bookingController.completeBooking
);

router.post(
  '/:bookingId/refund',
  paymentsController.refundPayment
);

router.patch(
  '/:id',
  verifyToken,
  bookingController.updateBooking
);

router.delete(
  '/:id',
  bookingController.deleteBooking
);

module.exports = router;