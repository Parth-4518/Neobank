const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create transporter (using Gmail SMTP as example)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

router.post('/send-add-money-email', async (req, res) => {
  const { email, amount, balance, date } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ error: 'Email and amount required' });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'NeoBank <no-reply@neobank.com>',
      to: email,
      subject: 'Money Added to Your NeoBank Wallet',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: #1e3a8a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NeoBank</h1>
            <p style="color: #93c5fd; margin: 10px 0 0 0;">Money Added Successfully</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a8a; margin-top: 0;">Transaction Confirmation</h2>
            
            <p style="color: #666;">Hello,</p>
            <p style="color: #666;">You have successfully added money to your NeoBank wallet. Here are the details:</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Amount Added:</span>
                <span style="color: #1e3a8a; font-weight: bold;">$${amount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">New Balance:</span>
                <span style="color: #1e3a8a; font-weight: bold;">$${balance}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Date & Time:</span>
                <span style="color: #1e3a8a;">${date || new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <p style="color: #666; margin-top: 20px;">If you did not initiate this transaction, please contact our support team immediately.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3000" style="background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Open NeoBank</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email from NeoBank. Please do not reply.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

module.exports = router;