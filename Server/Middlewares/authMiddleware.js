const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token || 
                req.headers?.authorization?.split(' ')[1] ||
                req.headers?.cookie?.match(/token=([^;]+)/)?.[1];

  
  if (!token) {
    console.error('No token found in request');
    return res.status(401).json({ 
      success: false, 
      message: 'User authentication required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions for this action' 
      });
    }
    next();
  };
};