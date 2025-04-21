const Booking = require('../Models/bookingModel');
const paypal = require('@paypal/checkout-server-sdk');
const createAppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Configure PayPal SDK
const configureEnvironment = function() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

const client = new paypal.core.PayPalHttpClient(configureEnvironment());

// Create PayPal order
exports.createPayPalOrder = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);
  
  if (!booking) {
    return next(createAppError('No booking found with that ID', 404));
  }

  if (booking.paymentStatus === 'paid') {
    return next(createAppError('This booking is already paid', 400));
  }

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: (booking.totalPrice / 3.75).toFixed(2), // Convert SAR to USD
      },
      description: `Booking for screen from ${booking.startDate} to ${booking.endDate}`,
      custom_id: booking._id.toString()
    }],
    application_context: {
      brand_name: 'Your Company Name',
      user_action: 'PAY_NOW',
      return_url: `${req.protocol}://${req.get('host')}/api/payments/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/api/payments/cancel`
    }
  });

  try {
    const order = await client.execute(request);
    res.status(200).json({
      status: 'success',
      data: {
        orderID: order.result.id
      }
    });
  } catch (err) {
    console.error('PayPal error:', err);
    return next(createAppError('Error creating PayPal order', 500));
  }
});

// Capture PayPal payment
exports.capturePayPalPayment = catchAsync(async (req, res, next) => {
  const { orderID } = req.body;
  
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    
    // Update booking payment status
    const bookingId = capture.result.purchase_units[0].custom_id;
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'paid',
      paymentMethod: 'paypal',
      paymentDate: new Date()
    });

    res.status(200).json({
      status: 'success',
      data: {
        capture
      }
    });
  } catch (err) {
    console.error('PayPal capture error:', err);
    return next(createAppError('Error capturing PayPal payment', 500));
  }
});

// Get payment details
exports.getPaymentDetails = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);
  
  if (!booking) {
    return next(createAppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      paymentDate: booking.paymentDate
    }
  });
});