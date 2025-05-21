const Hero = require('../Models/heroModel');

// Create initial hero data (POST)
exports.createHeroData = async (req, res) => {
  try {
    // Check if hero data already exists
    const existingHero = await Hero.findOne();
    if (existingHero) {
      return res.status(400).json({
        success: false,
        message: 'Hero data already exists. Use PUT to update instead.'
      });
    }

    const { videoUrl, title, subtitle, buttonText } = req.body;

    const heroData = await Hero.create({
      videoUrl: videoUrl || 'https://example.com/default-video.mp4',
      title: title || 'Welcome to Spot Flash',
      subtitle: subtitle || 'We own more than 50 digital screens strategically located across Jordan\'s governorates.',
      buttonText: buttonText || 'Explore Screens'
    });

    res.status(201).json({
      success: true,
      message: 'Hero data created successfully',
      data: heroData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create hero data',
      error: error.message
    });
  }
};

// Get hero section data
exports.getHeroData = async (req, res) => {
  try {
    // Get the first hero document (we'll only have one)
    const heroData = await Hero.findOne().sort({ createdAt: -1 });
    
    if (!heroData) {
      // Create default if none exists
      const defaultHero = await Hero.create({
        videoUrl: 'https://example.com/default-video.mp4',
        title: 'Welcome to Spot Flash',
        subtitle: 'We own more than 50 digital screens strategically located across Jordan\'s governorates.',
        buttonText: 'Explore Screens'
      });
      
      return res.status(200).json({
        success: true,
        data: defaultHero
      });
    }

    res.status(200).json({
      success: true,
      data: heroData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero data',
      error: error.message
    });
  }
};

// Update hero section data (Admin only)
exports.updateHeroData = async (req, res) => {
  try {
    const { videoUrl, title, subtitle, buttonText } = req.body;

    // Find the latest hero data
    let heroData = await Hero.findOne().sort({ createdAt: -1 });

    if (!heroData) {
      // Create new if none exists
      heroData = await Hero.create({
        videoUrl,
        title,
        subtitle,
        buttonText
      });
    } else {
      // Update existing
      heroData.videoUrl = videoUrl || heroData.videoUrl;
      heroData.title = title || heroData.title;
      heroData.subtitle = subtitle || heroData.subtitle;
      heroData.buttonText = buttonText || heroData.buttonText;
      
      await heroData.save();
    }

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      data: heroData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update hero data',
      error: error.message
    });
  }
};