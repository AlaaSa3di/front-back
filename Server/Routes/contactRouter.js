const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken, checkRole } = require('../Middlewares/authMiddleware');

// Public routes
router.post('/', contactController.submitContactForm);
router.use(verifyToken);
// Admin routes (protected)
router.get('/', checkRole(['admin']), contactController.getAllMessages);
router.get('/:id',checkRole(['admin']), contactController.getMessage);
router.post('/:id/reply',checkRole(['admin']), contactController.sendReply);
router.put('/:id/status',checkRole(['admin']), contactController.updateMessageStatus);
router.delete('/:id',checkRole(['admin']), contactController.deleteMessage);

module.exports = router;