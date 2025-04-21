// const jwt = require('jsonwebtoken');
// const User = require('../Models/userModel'); // استيراد النموذج من ملف userModel.js

// // Middleware للتحقق من التوكن
// const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "No token, authorization denied" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded._id || !decoded.role) {
//       return res.status(401).json({ message: "Invalid token structure" });
//     }

//     req.user = decoded;  
//     console.log("Authenticated User:", req.user);

//     next();  

//   } catch (error) {
//     // إذا كان التوكن غير صالح
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Token has expired" });
//     }
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     // لأي أخطاء أخرى
//     return res.status(401).json({ message: "Authorization failed", error: error.message });
//   }
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  // طريقة محسنة لقراءة التوكن من مصادر متعددة
  const token = req.cookies?.token || 
                req.headers?.authorization?.split(' ')[1] ||
                req.headers?.cookie?.match(/token=([^;]+)/)?.[1];

  console.log('Extracted token:', token); // أضف هذا للتصحيح
  
  if (!token) {
    console.error('No token found in request');
    return res.status(401).json({ 
      success: false, 
      message: 'User authentication required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // أضف هذا للتصحيح
    
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