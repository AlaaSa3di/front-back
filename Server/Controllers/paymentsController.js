const Booking = require('../Models/bookingModel');
const paypal = require('@paypal/checkout-server-sdk');
const createAppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Initialize PayPal
const environment = () => {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
  );
};

const client = () => {
  return new paypal.core.PayPalHttpClient(environment());
};

// Create PayPal order
exports.createPayPalOrder = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return next(createAppError('No booking found with this ID', 404));
  }

  if (booking.paymentStatus === 'paid') {
    return next(createAppError('This booking has already been paid', 400));
  }

  // Convert JOD to USD
  const exchangeRate = parseFloat(process.env.EXCHANGE_RATE || 1.41);
  const amountUSD = (booking.totalPrice * exchangeRate).toFixed(2);

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: process.env.CURRENCY || 'USD',
        value: amountUSD,
        breakdown: {
          item_total: {
            currency_code: process.env.CURRENCY || 'USD',
            value: amountUSD
          }
        }
      },
      description: `Advertising Booking - ${booking._id} (Original Amount: ${booking.totalPrice} JOD)`,
      custom_id: booking._id.toString(),
      invoice_id: `INV-${booking._id}-${Date.now()}`
    }],
    application_context: {
      brand_name: process.env.APP_NAME || 'Orange Booking',
      user_action: 'PAY_NOW',
      return_url: `${process.env.CLIENT_URL}/bookings/${booking._id}/success?amount=${booking.totalPrice}&currency=JOD`,
      cancel_url: `${process.env.CLIENT_URL}/bookings/${booking._id}/cancel`,
      locale: 'ar-EG'
    }
  });

  try {
    const order = await client().execute(request);
    
    // Save payment details
    booking.paymentDetails = {
      originalAmount: booking.totalPrice,
      originalCurrency: 'JOD',
      convertedAmount: amountUSD,
      convertedCurrency: 'USD',
      exchangeRate: exchangeRate
    };
    await booking.save();

    res.status(200).json({
      status: 'success',
      data: {
        orderID: order.result.id,
        paymentLink: order.result.links.find(link => link.rel === 'approve').href,
        originalAmount: booking.totalPrice,
        originalCurrency: 'JOD',
        convertedAmount: amountUSD,
        convertedCurrency: 'USD'
      }
    });
  } catch (err) {
    console.error('PayPal Error:', err);
    return next(createAppError('Failed to create payment request: ' + err.message, 500));
  }
});

// Confirm payment
exports.capturePayPalPayment = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const { orderID } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(createAppError('No booking found with this ID', 404));
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client().execute(request);
    
    if (capture.result.status !== 'COMPLETED') {
      return next(createAppError('Payment confirmation failed', 400));
    }

    booking.paymentStatus = 'paid';
    booking.paymentDetails = {
      method: 'paypal',
      id: capture.result.id,
      status: capture.result.status,
      amount: capture.result.purchase_units[0].payments.captures[0].amount.value,
      currency: capture.result.purchase_units[0].payments.captures[0].amount.currency_code,
      captureTime: capture.result.purchase_units[0].payments.captures[0].create_time,
      payer: capture.result.payer
    };
    
    // You can update the booking status here if needed
    // booking.status = 'pending'; // or any other status that fits your workflow
    
    await booking.save();

    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  } catch (err) {
    console.error('PayPal Capture Error:', err);
    return next(createAppError('Payment processing failed', 500));
  }
});

// Process refund
exports.refundPayment = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return next(createAppError('No booking found with this ID', 404));
  }

  if (booking.paymentStatus !== 'paid') {
    return next(createAppError('No payment to refund', 400));
  }

  if (!booking.paymentDetails?.id) {
    return next(createAppError('Insufficient payment information', 400));
  }

  const captureId = booking.paymentDetails.id;
  const request = new paypal.payments.CapturesRefundRequest(captureId);
  request.requestBody({
    amount: {
      value: booking.totalPrice.toFixed(3),
      currency_code: process.env.CURRENCY || 'JOD'
    },
    note_to_payer: 'Amount refunded due to booking cancellation'
  });

  try {
    const refund = await client().execute(request);
    
    booking.paymentStatus = 'refunded';
    booking.paymentDetails.refund = {
      id: refund.result.id,
      status: refund.result.status,
      amount: refund.result.amount.value,
      currency: refund.result.amount.currency_code,
      refundTime: refund.result.create_time
    };
    await booking.save();

    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  } catch (err) {
    console.error('PayPal Refund Error:', err);
    return next(createAppError('Refund failed', 500));
  }
});