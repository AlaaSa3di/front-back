const Space = require('../Models/spaceModel');
const path = require('path');
const fs = require('fs');
const upload = require('../utils/multerConfig');

// Create a new space
exports.createSpace = async (req, res) => {
  try {
    const { title, description, location, spaceType, dimensions } = req.body;

    // Handle file upload
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          filename: file.filename,
          path: path.join('uploads', 'spaces', file.filename),
          url: `${req.protocol}://${req.get('host')}/uploads/spaces/${file.filename}`
        });
      });
    }

    const space = new Space({
      owner: req.user.id,
      title,
      description,
      location: typeof location === 'string' ? JSON.parse(location) : location,
      spaceType,
      dimensions: typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions,
      images
    });

    await space.save();

    res.status(201).json({
      success: true,
      message: 'Space created successfully',
      data: space
    });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/spaces', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create space',
      error: error.message
    });
  }
};


// Get all active spaces
exports.getAllSpaces = async (req, res) => {
  try {
    const spaces = await Space.find().active().populate('owner', 'fullName email');
    
    res.status(200).json({
      success: true,
      count: spaces.length,
      data: spaces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spaces',
      error: error.message
    });
  }
};

// Get space by ID
exports.getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id).active().populate('owner', 'fullName email');
    
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    res.status(200).json({
      success: true,
      data: space
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch space',
      error: error.message
    });
  }
};

// Update space
exports.updateSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    // Check ownership
    if (space.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this space'
      });
    }

    const updatedSpace = await Space.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Space updated successfully',
      data: updatedSpace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update space',
      error: error.message
    });
  }
};

// Delete space (soft delete)
exports.deleteSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    // Check ownership
    if (space.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this space'
      });
    }

    // Soft delete
    space.isDeleted = true;
    space.deletedAt = new Date();
    await space.save();

    res.status(200).json({
      success: true,
      message: 'Space deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete space',
      error: error.message
    });
  }
};

// Approve space (admin only)
exports.approveSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve spaces'
      });
    }

    space.isApproved = true;
    await space.save();

    res.status(200).json({
      success: true,
      message: 'Space approved successfully',
      data: space
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve space',
      error: error.message
    });
  }
};
// Soft delete via PATCH
exports.softDeleteSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    // Check ownership
    if (space.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this space'
      });
    }

    // Soft delete
    space.isDeleted = true;
    space.deletedAt = new Date();
    await space.save();

    res.status(200).json({
      success: true,
      message: 'Space deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete space',
      error: error.message
    });
  }
};
exports.updateScreenStatus = async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(
      req.params.id,
      { isScreenInstalled: req.body.isScreenInstalled },
      { new: true }
    );

    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Space screen status updated',
      data: space
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update space status',
      error: error.message
    });
  }
};