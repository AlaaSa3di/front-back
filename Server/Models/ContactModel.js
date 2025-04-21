const mongoose = require('mongoose');
const validator = require('validator');

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'الاسم مطلوب'],
      trim: true,
      maxlength: [50, 'الاسم لا يمكن أن يتجاوز 50 حرفاً']
    },
    email: { 
      type: String, 
      required: [true, 'البريد الإلكتروني مطلوب'],
      lowercase: true,
      validate: [validator.isEmail, 'يرجى تقديم بريد إلكتروني صحيح']
    },
    message: { 
      type: String, 
      required: [true, 'الرسالة مطلوبة'],
      minlength: [10, 'الرسالة يجب أن تحتوي على الأقل على 10 أحرف'],
      maxlength: [1000, 'الرسالة لا يمكن أن تتجاوز 1000 حرف']
    },
    deleted: { 
      type: Boolean, 
      default: false 
    },
    deletedAt: { 
      type: Date,
      default: null
    },
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ['pending', 'replied', 'spam'],
      default: 'pending'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Query helper to exclude deleted messages
ContactMessageSchema.pre(/^find/, function(next) {
  this.where({ deleted: { $ne: true } });
  next();
});

// Add index for better performance
ContactMessageSchema.index({ email: 1, deleted: 1 });

const ContactMessage = mongoose.model("ContactMessage", ContactMessageSchema);

module.exports = ContactMessage;