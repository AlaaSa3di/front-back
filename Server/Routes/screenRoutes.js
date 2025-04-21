const express = require('express');
const router = express.Router();
const screenController = require('../Controllers/screenController');
const { verifyToken } = require('../Middlewares/authMiddleware');
const upload = require('../utils/screenMulterConfig');

// إنشاء شاشة جديدة
router.post('/', 
  verifyToken, 
  upload.single('screenImage'), 
  screenController.createScreen
);

// الحصول على جميع الشاشات
router.get('/', screenController.getAllScreens);

// الحصول على شاشة محددة
router.get('/:id', screenController.getScreen);

// تحديث شاشة
router.put('/:id', 
  verifyToken, 
  upload.single('screenImage'), 
  screenController.updateScreen
);

// حذف شاشة
router.delete('/:id', verifyToken, screenController.deleteScreen);

module.exports = router;