const express = require('express');
const router = express.Router();
const spaceController = require('../Controllers/spaceController');
const { verifyToken } = require('../Middlewares/authMiddleware');
const upload = require('../utils/multerConfig');

// Create a space (with image upload)
router.post('/', verifyToken, upload.array('images', 5), spaceController.createSpace);

// Get all active spaces
router.get('/', spaceController.getAllSpaces);
// Get spaces owned by current user
router.get('/my-spaces', verifyToken, spaceController.getMySpaces);


// Get space by ID
router.get('/:id', spaceController.getSpaceById);
// Update space
router.put('/:id', verifyToken, spaceController.updateSpace);

// Delete space (soft delete)
router.delete('/:id', verifyToken, spaceController.deleteSpace);

// Approve space (admin only)
router.patch('/:id/approve', verifyToken, spaceController.approveSpace);
router.patch('/:id/soft-delete', verifyToken, spaceController.softDeleteSpace);
router.patch('/:id/update-screen-status', verifyToken, spaceController.updateScreenStatus);

module.exports = router;