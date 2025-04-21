const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');
const { verifyToken } = require('../Middlewares/authMiddleware');

router.use(verifyToken);

router.post('/:bookingId/paypal', paymentController.createPayPalOrder);
router.post('/capture', paymentController.capturePayPalPayment);
router.get('/:bookingId/details', paymentController.getPaymentDetails);

module.exports = router;