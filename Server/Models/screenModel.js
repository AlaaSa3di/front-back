const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: [true, 'Associated space must be specified']
  },
  screenImage: {
    filename: String,
    path: String,
    url: String
  },
  installedDimensions: {
    width: { type: Number, required: [true, 'Screen width must be specified'] },
    height: { type: Number, required: [true, 'Screen height must be specified'] },
    unit: { type: String, enum: ['cm', 'm', 'in'], default: 'm' }
  },
  dailyPrice: {
    type: Number,
    required: [true, 'Daily advertising price must be specified'],
    min: [0, 'Price cannot be less than zero']
  },
  adsCount: { type: Number, default: 0 },
  favoritesCount: { type: Number, default: 0 },
  installationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'out_of_service'],
    default: 'active'
  },
  specifications: {
    resolution: String,
    brightness: String,
    technology: { type: String, enum: ['LED', 'LCD', 'OLED', null], default: null }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to link space data
screenSchema.virtual('spaceDetails', {
  ref: 'Space',
  localField: 'space',
  foreignField: '_id',
  justOne: true
});

// Virtual to link owner data
screenSchema.virtual('ownerDetails', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  justOne: true
});

screenSchema.index({ 
  'spaceDetails.name': 'text',
  'spaceDetails.location': 'text',
  'specifications.resolution': 'text'
}, { 
  weights: {
    'spaceDetails.name': 5,
    'spaceDetails.location': 3,
    'specifications.resolution': 1
  }
});

module.exports = mongoose.model('Screen', screenSchema);