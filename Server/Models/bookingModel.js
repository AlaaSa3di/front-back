const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: [true, 'Booking must belong to a screen']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date must be specified']
  },
  endDate: {
    type: Date,
    required: [true, 'End date must be specified'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
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
    required: [true, 'Total price must be calculated']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['paypal', 'card'],
    },
    id: String,
    status: String,
    amount: Number,
    currency: String,
    refund: Object,
    capturedAt: Date
  },
  days: {
    type: Number,
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
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
  if (this.isModified('startDate') || this.isModified('endDate') || this.isNew) {
    const days = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
    const screen = await mongoose.model('Screen').findById(this.screen);
    this.totalPrice = days * screen.dailyPrice;
    this.days = days;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;