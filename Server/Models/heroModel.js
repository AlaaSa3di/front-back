const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true
  },
  title: {
    type: String,
    default: 'Welcome to Spot Flash'
  },
  subtitle: {
    type: String,
    default: 'We own more than 50 digital screens strategically located across Jordan\'s governorates.'
  },
  buttonText: {
    type: String,
    default: 'Explore Screens'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update the updatedAt field before saving
heroSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Hero', heroSchema);