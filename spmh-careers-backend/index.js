/**
 * SPMH CAREERS BACKEND
 *
 * Node.js Express server that:
 * 1. Receives job application submissions from the React frontend
 * 2. Validates the data
 * 3. Sends an email to HR with the application details
 *
 * This is a learning example. In production, you'd add:
 * - Database storage (PostgreSQL, MongoDB)
 * - Authentication & security
 * - Rate limiting
 * - Better error handling
 */

// ============================================
// SETUP & DEPENDENCIES
// ============================================

const { hrEmailTemplate, applicantEmailTemplate } = require('./emailTemplate');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from your React frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only allow PDF, DOC, DOCX
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  },
});

// ============================================
// EMAIL CONFIGURATION
// ============================================

/**
 * Configure your email service here.
 * Options:
 * 1. Gmail (free, simple setup)
 * 2. Sendgrid (recommended for production)
 * 3. Mailgun
 * 4. Your hosting provider's SMTP
 */

const transporter = nodemailer.createTransport({
  // OPTION 1: Gmail (requires "App Password" - see setup instructions below)
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },

  // OPTION 2: SendGrid (uncomment if using SendGrid)
  // host: 'smtp.sendgrid.net',
  // port: 587,
  // auth: {
  //   user: 'apikey',
  //   pass: process.env.SENDGRID_API_KEY
  // }
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/apply
 *
 * Handles job application submissions
 *
 * Expected data:
 * - fullName: string (required)
 * - email: string (required, valid email)
 * - phone: string (required)
 * - position: string (required, job title)
 * - coverLetter: string (optional)
 * - file: file (optional, CV/resume)
 */
app.post('/api/apply', upload.single('file'), async (req, res) => {
  try {
    // Extract form data from request
    const { fullName, email, phone, position, coverLetter } = req.body;

    // ========== VALIDATION ==========
    // Check that all required fields are present
    if (!fullName || !email || !phone || !position) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, email, phone, position',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // ========== PREPARE EMAIL ==========

    // Build email body with application details
    let emailBody = `
New Job Application Received
============================

APPLICANT INFORMATION:
Name: ${fullName}
Email: ${email}
Phone: ${phone}

POSITION APPLIED FOR:
${position}

COVER LETTER:
${coverLetter || '(No cover letter provided)'}

============================
This application was submitted via the SPMH Careers Portal.
    `.trim();

    // Email to HR
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'agumbamats@gmail.com',
      subject: `New Application: ${position} - ${fullName}`,
      html: hrEmailTemplate({ fullName, email, phone, position, coverLetter }),
      attachments: [],
    };

    // Confirmation email to applicant
    const applicantMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Application Received — ${position} | SPMH`,
      html: applicantEmailTemplate({ fullName, position }),
    };
    // ========== SEND EMAIL ==========

    // Send email to HR
    // Send email to HR
    await transporter.sendMail(mailOptions);
    console.log(`✓ HR email sent for ${fullName}`);

    // Send email to HR
    await transporter.sendMail(mailOptions);
    console.log(`✓ HR email sent for ${fullName}`);

    // Send confirmation to applicant
    await transporter.sendMail(applicantMailOptions);
    console.log(`✓ Confirmation email sent to ${email}`);

    // Optional: Save application to database here
    // await saveApplicationToDatabase({ fullName, email, phone, position, coverLetter });

    // ========== CLEANUP ==========

    // Delete uploaded file after sending (to save space)
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    // ========== SUCCESS RESPONSE ==========

    res.status(200).json({
      success: true,
      message:
        'Application submitted successfully! HR will review and contact you within 48 hours.',
    });
  } catch (error) {
    console.error('Application submission error:', error.message);
    console.error('Full error:', error);

    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    // Send error response
    res.status(500).json({
      success: false,
      message:
        'Error submitting application. Please try again or contact HR directly.',
    });
  }
});

// Test email route
app.get('/api/test-email', async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'agumbamats@gmail.com',
      subject: 'SPMH Test Email',
      text: 'If you receive this, your email setup is working perfectly!',
    });
    console.log('✅ Test email sent:', info.messageId);
    console.log('✅ Accepted:', info.accepted);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.log('❌ Test email failed:', error.message);
    res.json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error. Please try again later.',
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  SPMH Careers Backend Server Running   ║
║  Port: 5000                             ║
║  Email Service: Configured             ║
╚════════════════════════════════════════╝
  `);
  console.log('API ready to receive applications at POST /api/apply');

  // Test Gmail connection on startup
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Gmail connection FAILED:', error.message);
    } else {
      console.log('✅ Gmail connection SUCCESS — ready to send emails');
    }
  });
});
