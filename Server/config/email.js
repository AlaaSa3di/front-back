const Mailgun = require('mailgun.js');
const formData = require('form-data');
const pug = require('pug');
const path = require('path');
const htmlToText = require('html-to-text');

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: process.env.MAILGUN_API_URL || 'https://api.mailgun.net'
});

const sendEmail = async (options) => {
  try {
    // 1) Render HTML template
    const html = pug.renderFile(
      path.join(__dirname, `../emails/${options.template}.pug`),
      {
        name: options.name,
        message: options.message,
        subject: options.subject
      }
    );

    // 2) Prepare email data
    const emailData = {
      from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: html,
      text: htmlToText.fromString(html)
    };

    // 3) Send email
    await mg.messages.create(process.env.MAILGUN_DOMAIN, emailData);
    console.log('Email sent successfully via Mailgun');
  } catch (error) {
    console.error('Error sending email with Mailgun:', error);
    throw error;
  }
};

module.exports = sendEmail;