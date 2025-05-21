const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title for the space']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  location: {
    type: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: [true, 'Please add an address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    zone: {
      type: String,
      required: [true, 'Please add a zone']
    }
  },
  spaceType: {
    type: String,
    enum: ['building_facade', 'mall_interior', 'billboard', 'public_transport', 'other'],
    required: true
  },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  images: [{
    filename: String,
    path: String,
    url: String
  }],
  isScreenInstalled: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Query helper to exclude deleted spaces
spaceSchema.query.active = function() {
  return this.where({ isDeleted: false });
};

module.exports = mongoose.model('Space', spaceSchema);