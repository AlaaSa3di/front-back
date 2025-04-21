const ContactMessage = require('../models/contactModel');
const sendEmail = require('../config/email');
const { validationResult } = require('express-validator');
const APIFeatures = require('../utils/apiFeatures');

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, message } = req.body;

    const newMessage = new ContactMessage({
      name,
      email,
      message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await newMessage.save();

    try {
      // Send confirmation email to user
      await sendEmail({
        email: email,
        subject: 'تم استلام رسالتك بنجاح',
        template: 'contactConfirmation',
        name: name,
        message: message
      });

      // Send notification to admin
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: 'رسالة تواصل جديدة',
        template: 'contactNotification',
        name: name,
        message: message
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح!',
      data: newMessage
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الرسالة',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all messages (for admin)
exports.getAllMessages = async (req, res) => {
  try {
    const features = new APIFeatures(ContactMessage.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const messages = await features.query;

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسائل',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get deleted messages (for admin)
exports.getDeletedMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ deleted: true })
      .sort({ deletedAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error getting deleted messages:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسائل المحذوفة',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Soft delete message
exports.softDeleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { 
        deleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على الرسالة'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف الرسالة بنجاح (حذف ناعم)',
      data: message
    });
  } catch (error) {
    console.error('Error soft deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الرسالة',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Restore message
exports.restoreMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { 
        deleted: false,
        deletedAt: null
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على الرسالة'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم استعادة الرسالة بنجاح',
      data: message
    });
  } catch (error) {
    console.error('Error restoring message:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء استعادة الرسالة',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Hard delete message
exports.hardDeleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على الرسالة'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف الرسالة نهائياً بنجاح'
    });
  } catch (error) {
    console.error('Error hard deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحذف النهائي',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};