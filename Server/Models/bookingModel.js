const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'يجب أن ينتمي الحجز إلى مستخدم']
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: [true, 'يجب أن ينتمي الحجز إلى شاشة']
  },
  startDate: {
    type: Date,
    required: [true, 'يجب تحديد تاريخ البدء']
  },
  endDate: {
    type: Date,
    required: [true, 'يجب تحديد تاريخ الانتهاء'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء'
    }
  },
  design: {
    filename: String,
    path: String,
    url: String,
    mimetype: String
  },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: [true, 'يجب حساب السعر الإجمالي']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
bookingSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

bookingSchema.virtual('screenDetails', {
  ref: 'Screen',
  localField: 'screen',
  foreignField: '_id',
  justOne: true
});

// Calculate total price before saving
bookingSchema.pre('save', async function(next) {
  const days = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
  const screen = await mongoose.model('Screen').findById(this.screen);
  this.totalPrice = days * screen.dailyPrice;
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;