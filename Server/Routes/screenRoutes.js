const express = require('express');
const router = express.Router();
const screenController = require('../Controllers/screenController');
const { verifyToken } = require('../Middlewares/authMiddleware');
const upload = require('../utils/screenMulterConfig');

router.post('/', 
  verifyToken, 
  upload.single('screenImage'), 
  screenController.createScreen
);

router.get('/', screenController.getAllScreens);
router.get('/active', screenController.getScreensActive);
router.get('/space-types', screenController.getSpaceTypes);
router.get('/:id', screenController.getScreen);

router.put('/:id', 
  verifyToken, 
  upload.single('screenImage'), 
  screenController.updateScreen
);
router.put('/:id/status', 
  verifyToken, 
  screenController.updateScreenStatus
);
router.delete('/:id', verifyToken, screenController.deleteScreen);

module.exports = router;