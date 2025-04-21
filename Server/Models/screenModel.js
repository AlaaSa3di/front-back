const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: [true, 'يجب تحديد المساحة المرتبطة بالشاشة']
  },
  screenImage: {
    filename: String,
    path: String,
    url: String
  },
  installedDimensions: {
    width: { type: Number, required: [true, 'يجب تحديد عرض الشاشة'] },
    height: { type: Number, required: [true, 'يجب تحديد ارتفاع الشاشة'] },
    unit: { type: String, enum: ['cm', 'm', 'in'], default: 'm' }
  },
  dailyPrice: {
    type: Number,
    required: [true, 'يجب تحديد سعر الإعلان اليومي'],
    min: [0, 'لا يمكن أن يكون السعر أقل من الصفر']
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

// تعريف virtual لربط بيانات المساحة
screenSchema.virtual('spaceDetails', {
  ref: 'Space',
  localField: 'space',
  foreignField: '_id',
  justOne: true
});

// تعريف virtual لربط بيانات المالك
screenSchema.virtual('ownerDetails', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Screen', screenSchema);