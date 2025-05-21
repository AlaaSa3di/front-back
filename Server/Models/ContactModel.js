const mongoose = require('mongoose');
const validator = require('validator');

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    message: { 
      type: String, 
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    replies: [{
      message: { type: String, required: true },
      repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }],
    repliedAt: Date,
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