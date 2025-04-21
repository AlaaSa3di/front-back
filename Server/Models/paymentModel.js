const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Payment must belong to a booking']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payment must belong to a user']
  },
  amount: {
    type: Number,
    required: [true, 'Payment must have an amount']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'JOD']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please specify payment method'],
    enum: ['paypal', 'credit_card', 'bank_transfer']
  },
  transactionId: {
    type: String,
    required: [true, 'Payment must have a transaction ID']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'failed', 'refunded']
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentDetails: {
    type: Object,
    // يمكن تخزين تفاصيل إضافية من بوابة الدفع هنا
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionId: 1 }, { unique: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;