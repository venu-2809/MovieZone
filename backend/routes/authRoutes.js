// filepath: backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '427168535755-avbl1pgi191fj9iv7la64kuj0kg98h0k.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, deviceId } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, deviceId });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login a user (single device enforcement)
router.post('/login', async (req, res) => {
  const { email, password, deviceId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Enforce single device login
    if (user.deviceId && user.deviceId !== deviceId) {
      return res.status(403).json({ message: 'Account is already logged in on another device.' });
    }

    // Save deviceId if not set
    if (!user.deviceId) {
      user.deviceId = deviceId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      username: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google Login (single device enforcement)
router.post('/google', async (req, res) => {
  try {
    const { credential, deviceId } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email });

    // If user exists, enforce single device login
    if (user) {
      if (user.deviceId && user.deviceId !== deviceId) {
        return res.status(403).json({ message: 'Account is already logged in on another device.' });
      }
      // Save deviceId if not set
      if (!user.deviceId) {
        user.deviceId = deviceId;
        await user.save();
      }
    } else {
      // Create new user with deviceId
      user = await User.create({
        name,
        email,
        password: sub, // random string, since Google users don't need a password
        deviceId: deviceId || '',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      username: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed', error: error.message });
  }
});
// Logout endpoint (requires JWT)
router.post('/logout', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.deviceId = '';
      await user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
});
router.delete('/delete', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

module.exports = router;