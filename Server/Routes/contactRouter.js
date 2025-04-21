const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const contactController = require('../Controllers/contactController');

// Validation rules
const contactValidationRules = [
  body('name')
    .notEmpty().withMessage('الاسم مطلوب')
    .trim()
    .isLength({ max: 50 }).withMessage('الاسم لا يمكن أن يتجاوز 50 حرفاً'),
  
  body('email')
    .notEmpty().withMessage('البريد الإلكتروني مطلوب')
    .isEmail().withMessage('يرجى تقديم بريد إلكتروني صحيح')
    .normalizeEmail(),
  
  body('message')
    .notEmpty().withMessage('الرسالة مطلوبة')
    .trim()
    .isLength({ min: 10 }).withMessage('الرسالة يجب أن تحتوي على الأقل على 10 أحرف')
    .isLength({ max: 1000 }).withMessage('الرسالة لا يمكن أن تتجاوز 1000 حرف')
];

// Submit contact form
router.post('/', contactValidationRules, contactController.submitContactForm);

// Get all messages (admin only)
router.get('/', contactController.getAllMessages);

// Get deleted messages (admin only)
router.get('/deleted', contactController.getDeletedMessages);

// Soft delete message (admin only)
router.patch('/soft-delete/:id', contactController.softDeleteMessage);

// Restore message (admin only)
router.patch('/restore/:id', contactController.restoreMessage);

// Hard delete message (admin only)
router.delete('/hard-delete/:id', contactController.hardDeleteMessage);

module.exports = router;