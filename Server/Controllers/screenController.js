const Screen = require('../Models/screenModel');
const Space = require('../Models/spaceModel');
const path = require('path');
const fs = require('fs');

// Create a new screen
exports.createScreen = async (req, res) => {
  try {
    const { spaceId, dailyPrice, installedDimensions, specifications } = req.body;
    
    // Check if space exists
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    // Process screen image
    let screenImage = {};
    if (req.file) {
      screenImage = {
        filename: req.file.filename,
        path: path.join('uploads', 'screens', req.file.filename),
        url: `${req.protocol}://${req.get('host')}/uploads/screens/${req.file.filename}`
      };
    }

    const screen = await Screen.create({
      space: spaceId,
      screenImage,
      installedDimensions: JSON.parse(installedDimensions),
      dailyPrice,
      specifications: JSON.parse(specifications),
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Screen created successfully',
      data: screen
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../uploads/screens', req.file.filename));
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create screen',
      error: error.message
    });
  }
};

// Get all active screens
exports.getScreensActive = async (req, res) => {
  try {
    // Get all active screens with space and owner details
    const screens = await Screen.find({ status: 'active' })
      .populate({
        path: 'spaceDetails',
        select: 'title location dimensions spaceType'
      })
      .populate({
        path: 'ownerDetails',
        select: 'fullName email'
      });

    res.status(200).json({
      success: true,
      count: screens.length,
      data: screens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screens data',
      error: error.message
    });
  }
};

// Get all screens
exports.getAllScreens = async (req, res) => {
  try {
    // Get all screens with space and owner details
    const screens = await Screen.find()
      .populate({
        path: 'spaceDetails',
        select: 'title location dimensions spaceType'
      })
      .populate({
        path: 'ownerDetails',
        select: 'fullName email'
      });

    res.status(200).json({
      success: true,
      count: screens.length,
      data: screens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screens data',
      error: error.message
    });
  }
};

// Get specific screen
exports.getScreen = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id)
      .populate('spaceDetails', 'title location dimensions spaceType')
      .populate('ownerDetails', 'fullName email phoneNumber');

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    res.status(200).json({
      success: true,
      data: screen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screen data',
      error: error.message
    });
  }
};

// Get available space types
exports.getSpaceTypes = async (req, res) => {
  try {
    const spaceTypes = await Screen.aggregate([
      { $match: { status: 'active' } },
      { $lookup: {
          from: 'spaces',
          localField: 'space',
          foreignField: '_id',
          as: 'spaceDetails'
        }
      },
      { $unwind: '$spaceDetails' },
      { $group: {
          _id: '$spaceDetails.spaceType',
          count: { $sum: 1 }
        }
      },
      { $project: {
          spaceType: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: spaceTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch space types',
      error: error.message
    });
  }
};

// Update screen
exports.updateScreen = async (req, res) => {
  try {
    const { dailyPrice, installedDimensions, specifications, status } = req.body;
    const screen = await Screen.findById(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Check screen ownership
    if (screen.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this screen'
      });
    }

    // Update fields
    if (dailyPrice) screen.dailyPrice = dailyPrice;
    if (installedDimensions) screen.installedDimensions = installedDimensions;
    if (specifications) screen.specifications = specifications;
    if (status) screen.status = status;

    // Update image if new one was uploaded
    if (req.file) {
      if (screen.screenImage?.path) {
        fs.unlinkSync(path.join(__dirname, '../', screen.screenImage.path));
      }
      screen.screenImage = {
        filename: req.file.filename,
        path: path.join('uploads', 'screens', req.file.filename),
        url: `${req.protocol}://${req.get('host')}/uploads/screens/${req.file.filename}`
      };
    }

    await screen.save();

    res.status(200).json({
      success: true,
      message: 'Screen updated successfully',
      data: screen
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update screen',
      error: error.message
    });
  }
};

// Delete screen
exports.deleteScreen = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Check screen ownership
    if (screen.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this screen'
      });
    }

    // Delete screen image if exists
    if (screen.screenImage?.path) {
      fs.unlinkSync(path.join(__dirname, '../', screen.screenImage.path));
    }

    await screen.remove();

    res.status(200).json({
      success: true,
      message: 'Screen deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete screen',
      error: error.message
    });
  }
};

// Update screen status (active/maintenance/out_of_service)
exports.updateScreenStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const screen = await Screen.findById(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Check screen ownership
    if (screen.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this screen'
      });
    }

    // Validate requested status
    if (!['active', 'maintenance', 'out_of_service'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, maintenance, out_of_service'
      });
    }

    screen.status = status;
    await screen.save();

    res.status(200).json({
      success: true,
      message: 'Screen status updated successfully',
      data: screen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update screen status',
      error: error.message
    });
  }
};