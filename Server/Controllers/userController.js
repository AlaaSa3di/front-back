// const User = require("../Models/userModel");

// exports.details = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user data" });
//   }
// };

const User = require('../Models/userModel');
const Booking = require('../Models/bookingModel');
const fs = require('fs');
const path = require('path');

// Get user profile with bookings
exports.getUserProfile = async (req, res) => {
  try {
    // Get user details
    const user = await User.findById({ 
      _id: req.user.id, 
      isDeleted: false 
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or deactivated'
      });
    }

    // Get user bookings
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'screenDetails',
        select: 'installedDimensions dailyPrice specifications space status',
        populate: {
          path: 'spaceDetails',
          select: 'title location'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      bookings
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile data'
    });
  }
};

// Update user profile with picture handling
exports.updateUserProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;
    const updates = { fullName, phoneNumber };

    if (req.file) {
      const user = await User.findById(req.user.id);
      if (user.profilePicture) {
        const oldImagePath = path.join(__dirname, '..', user.profilePicture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updates.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};
// [1] Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role value'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};
// [2] Get all active users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password');
    res.status(200).json({ 
      success: true, 
      count: users.length,
      users 
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve users' 
    });
  }
};

// [3] Soft delete user (admin only)
exports.softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'User deactivated successfully',
      user 
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to deactivate user' 
    });
  }
};

// [4] Restore user (admin only)
exports.restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'User restored successfully',
      user 
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to restore user' 
    });
  }
};

// [5] Get all deleted users (admin only)
exports.getDeletedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: true }).select('-password');
    res.status(200).json({ 
      success: true, 
      count: users.length,
      users 
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch deleted users' 
    });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phoneNumber, profilePicture },
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password');

    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
};

// Delete user account
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('token');
    
    res.status(200).json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Account deletion error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete account' 
    });
  }
};