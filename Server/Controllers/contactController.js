const ContactMessage = require('../Models/ContactModel');
const nodemailer = require('nodemailer');
const validator = require('validator');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Additional validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Get client IP and user agent
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
      ipAddress,
      userAgent
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get all messages (for admin)
exports.getAllMessages = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) {
      filter.status = status;
    }

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get single message (for admin)
exports.getMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Send reply to message (for admin)
exports.sendReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reply message is required' 
      });
    }

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: message.email,
      subject: `Re: Your message to ${process.env.APP_NAME}`,
      text: `Dear ${message.name},\n\n${replyMessage}\n\nBest regards,\n${process.env.APP_NAME} Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Dear ${message.name},</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            ${replyMessage.replace(/\n/g, '<br>')}
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Best regards,<br>
            <strong>${process.env.APP_NAME} Team</strong>
          </p>
        </div>
      `
    };

    // Attempt to send email
    const emailResponse = await transporter.sendMail(mailOptions);

    // Save reply to database
    const newReply = {
      message: replyMessage,
      repliedBy: req.user._id, // Assuming you have user authentication
      emailId: emailResponse.messageId, // Store email ID for reference
      sentAt: new Date()
    };

    message.replies.push(newReply);
    message.status = 'replied';
    message.repliedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Reply sent and saved successfully',
      data: {
        reply: newReply,
        emailInfo: emailResponse
      }
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    
    // If email failed but DB was updated, you may want to handle that case
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send reply',
      error: error.message,
      emailError: error.response || null
    });
  }
};

// Update message status (for admin)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'replied', 'spam'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated',
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Delete message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { 
        deleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};