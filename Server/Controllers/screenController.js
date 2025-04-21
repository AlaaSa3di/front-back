const Screen = require('../Models/screenModel');
const Space = require('../Models/spaceModel');
const path = require('path');
const fs = require('fs');

// إنشاء شاشة جديدة
exports.createScreen = async (req, res) => {
  try {
    const { spaceId, dailyPrice, installedDimensions, specifications } = req.body;
    
    // التحقق من وجود المساحة
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'المساحة غير موجودة'
      });
    }

    // معالجة صورة الشاشة
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
      message: 'تم إنشاء الشاشة بنجاح',
      data: screen
    });
  } catch (error) {
    // حذف الصورة إذا حدث خطأ
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../uploads/screens', req.file.filename));
    }
    res.status(500).json({
      success: false,
      message: 'فشل في إنشاء الشاشة',
      error: error.message
    });
  }
};

// الحصول على جميع الشاشات
exports.getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.find()
      .populate('spaceDetails', 'title location dimensions')
      .populate('ownerDetails', 'fullName email');

    res.status(200).json({
      success: true,
      count: screens.length,
      data: screens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في جلب بيانات الشاشات',
      error: error.message
    });
  }
};

// الحصول على شاشة محددة
exports.getScreen = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id)
      .populate('spaceDetails', 'title location dimensions')
      .populate('ownerDetails', 'fullName email phoneNumber');

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'الشاشة غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      data: screen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في جلب بيانات الشاشة',
      error: error.message
    });
  }
};

// تحديث شاشة
exports.updateScreen = async (req, res) => {
  try {
    const { dailyPrice, installedDimensions, specifications } = req.body;
    const screen = await Screen.findById(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'الشاشة غير موجودة'
      });
    }

    // التحقق من ملكية الشاشة
    if (screen.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتحديث هذه الشاشة'
      });
    }

    // تحديث الحقول
    if (dailyPrice) screen.dailyPrice = dailyPrice;
    if (installedDimensions) screen.installedDimensions = JSON.parse(installedDimensions);
    if (specifications) screen.specifications = JSON.parse(specifications);

    // تحديث الصورة إذا تم رفع جديدة
    if (req.file) {
      // حذف الصورة القديمة إذا كانت موجودة
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
      message: 'تم تحديث الشاشة بنجاح',
      data: screen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في تحديث الشاشة',
      error: error.message
    });
  }
};

// حذف شاشة
exports.deleteScreen = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'الشاشة غير موجودة'
      });
    }

    // التحقق من ملكية الشاشة
    if (screen.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذه الشاشة'
      });
    }

    // حذف صورة الشاشة إذا كانت موجودة
    if (screen.screenImage?.path) {
      fs.unlinkSync(path.join(__dirname, '../', screen.screenImage.path));
    }

    await screen.remove();

    res.status(200).json({
      success: true,
      message: 'تم حذف الشاشة بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في حذف الشاشة',
      error: error.message
    });
  }
};