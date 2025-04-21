const Booking = require('../Models/bookingModel');
const Screen = require('../Models/screenModel');
const applyApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const createAppError = require('../utils/appError');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for design uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/bookings/designs');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `design-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf|psd|ai/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(createAppError('Error: Only image, PDF, PSD, and AI files are allowed!', 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('design');

exports.uploadDesign = upload;

exports.createBooking = catchAsync(async (req, res, next) => {
    // 1. التحقق من صحة التواريخ
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
  
    if (isNaN(startDate.getTime())) {
      return next(createAppError('تاريخ البدء غير صالح', 400));
    }
    if (isNaN(endDate.getTime())) {
      return next(createAppError('تاريخ الانتهاء غير صالح', 400));
    }
    if (endDate <= startDate) {
      return next(createAppError('تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء', 400));
    }
  
    // 2. جلب بيانات الشاشة مع التحقق من السعر اليومي
    const screen = await Screen.findById(req.body.screen).select('+dailyPrice +status');
    if (!screen) {
      return next(createAppError('لا توجد شاشة بهذا المعرف', 404));
    }
    if (screen.status !== 'active') {
      return next(createAppError('هذه الشاشة غير متاحة للحجز حالياً', 400));
    }
    if (!screen.dailyPrice || screen.dailyPrice <= 0) {
      return next(createAppError('لا يمكن الحجز على شاشة بدون سعر محدد', 400));
    }
  
    // 3. حساب عدد الأيام والسعر الإجمالي
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = screen.dailyPrice * days;
  
    // 4. التحقق من تعارض التواريخ
    // const existingBookings = await Booking.find({
    //   screen: req.body.screen,
    //   status: { $in: ['pending', 'approved'] },
    //   $or: [
    //     { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    //   ]
    // });
  
    // if (existingBookings.length > 0) {
    //   return next(createAppError('هذه الشاشة محجوزة بالفعل في التواريخ المحددة', 400));
    // }
  
    // 5. إنشاء الحجز
    const bookingData = {
      user: req.user.id,
      screen: req.body.screen,
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice,
      days: days,
      notes: req.body.notes,
      status: 'pending'
    };
  
    if (req.file) {
      bookingData.design = {
        filename: req.file.filename,
        path: req.file.path,
        url: `${req.protocol}://${req.get('host')}/uploads/bookings/designs/${req.file.filename}`,
        mimetype: req.file.mimetype
      };
    }
  
    const booking = await Booking.create(bookingData);
  
    // 6. تحديث إحصائيات الشاشة
    await Screen.findByIdAndUpdate(req.body.screen, {
      $inc: { adsCount: 1 }
    });
  
    res.status(201).json({
      status: 'success',
      data: {
        booking,
        priceDetails: {
          dailyPrice: screen.dailyPrice,
          days: days,
          totalPrice: totalPrice
        }
      }
    });
  });

  exports.getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({}) // إزالة الفلترة وجلب جميع الحجوزات
      .populate({
        path: 'screenDetails',
        select: 'installedDimensions dailyPrice specifications space status',
        populate: {
          path: 'spaceDetails',
          select: 'title location'
        }
      })
      .populate({
        path: 'userDetails',
        select: 'fullName email phoneNumber'
      });
  
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings
      }
    });
  });
  
  exports.getBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'screenDetails',
        select: 'installedDimensions dailyPrice specifications space status',
        populate: {
          path: 'spaceDetails',
          select: 'title location'
        }
      })
      .populate({
        path: 'userDetails',
        select: 'fullName email phoneNumber'
      });
  
    if (!booking) {
      return next(createAppError('لا يوجد حجز بهذا المعرف', 404));
    }
  
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return next(createAppError('غير مصرح لك بمشاهدة هذا الحجز', 403));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  });
exports.updateBookingStatus = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(createAppError('No booking found with that ID', 404));
  }

  // Only admin can update status
  if (req.user.role !== 'admin') {
    return next(createAppError('You are not authorized to update booking status', 403));
  }
// السماح بتحديث الحالة أو حالة الدفع
  booking.status = req.body.status;
  booking.updatedAt = Date.now();
  await booking.save();

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(createAppError('No booking found with that ID', 404));
  }

  // Only admin or booking owner can delete
  if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
    return next(createAppError('You are not authorized to delete this booking', 403));
  }

  // Delete design file if exists
  if (booking.design?.path) {
    fs.unlink(booking.design.path, err => {
      if (err) console.error('Error deleting design file:', err);
    });
  }

  await booking.remove();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);
  
    if (!booking) {
      return next(createAppError('لا يوجد حجز بهذا المعرف', 404));
    }
  
    // التحقق من الصلاحيات (المسؤول أو صاحب الحجز)
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return next(createAppError('غير مصرح لك بتحديث هذا الحجز', 403));
    }
  
    // السماح بتحديث الحالة أو حالة الدفع
    if (req.body.status) booking.status = req.body.status;
    if (req.body.paymentStatus) booking.paymentStatus = req.body.paymentStatus;
    
    booking.updatedAt = Date.now();
    await booking.save();
  
    res.status(200).json({
      status: 'success',
      data: {
        booking
      }
    });
  });