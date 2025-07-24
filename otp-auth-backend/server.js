const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));



app.use(bodyParser.json());

// In-memory OTP store
const OTPs = new Map();

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendMail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"OTP Auth" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });
}

// Send confirmation email after OTP is verified
async function sendUserConfirmationEmail(userEmail) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'OTP Verified Successfully',
    text: `Hello,\n\nYour OTP was successfully verified and you are now logged in.\n\nIf this wasn't you, please contact support immediately.`,
  });
}

// Route: Send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  OTPs.set(email, { otp, expiresAt });

  try {
    await sendMail(email, otp);
    res.json({ success: true, message: 'OTP sent!' });
  } catch (err) {
    console.error('Failed to send OTP email:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Route: Verify OTP
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = OTPs.get(email);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No OTP sent' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  OTPs.delete(email); // Remove used OTP

  try {
    await sendUserConfirmationEmail(email); // Send confirmation email
  } catch (err) {
    console.error('Failed to send confirmation email:', err.message);
  }

  res.json({ success: true, message: 'OTP verified, login success' });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
