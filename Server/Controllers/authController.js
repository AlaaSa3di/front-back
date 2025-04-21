// controllers/authController.js
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../Models/userModel"); // User model
// const dotenv = require("dotenv");

// dotenv.config();

// // Registration handler
// const registerUser = async (req, res) => {
//   const { fullName, email, password, role } = req.body;

//   if (!fullName || !email || !password) {
//     return res
//       .status(400)
//       .json({ message: "Full name, email, and password are required" });
//   }

  // const emailRegex = /\S+@\S+\.\S+/;
  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({ message: 'Invalid email format' });
  // }

  // if (password.length < 8) {
  //   return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  // }

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//       role: role || "user",
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       { _id: newUser._id, role: newUser.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "2h" }
//     );

//     res.status(201).json({
//       token,
//       user: {
//         id: newUser._id,
//         fullName: newUser.fullName,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// Login handler
// controllers/authController.js
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   // Check if email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Compare the provided password with the stored hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "2h" } 
//     );

//     res.status(200).json({
//       token,
//       user: {
//         id: user.id,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // دالة لفك التوكن
// const verifyToken = (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded; // يحتوي على _id و email و role
//   } catch (error) {
//     throw new Error("توكن غير صالح");
//   }
// };
// module.exports = { registerUser, loginUser, verifyToken };


const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createAppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
require('dotenv').config();

// Token generation helper
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// User registration
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is already registered' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber
    });

    await user.save();

    // Generate and set token
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000, // 24 hours
      sameSite: 'lax'
    });

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      user: userData 
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to complete registration' 
    });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate and set token
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
      sameSite: 'lax'
    });

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: userData 
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process login' 
    });
  }
};
// Authentication middleware
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new createAppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new createAppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Grant access to protected route
  req.user = currentUser;
  next();
});

// Authorization middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new createAppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Get current user profile
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return next(new createAppError('User account not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture
      }
    }
  });
});

// User logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    status: 'success',
    message: 'Logout successful'
  });
};