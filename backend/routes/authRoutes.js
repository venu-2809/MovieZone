// filepath: backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

// Login a user
router.post('/login', async (req, res) => {
    const { email, password, deviceId } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isPasswordMatch = await user.matchPassword(password);
      if (!isPasswordMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      if (user.deviceId !== deviceId) {
        return res.status(403).json({ message: 'Access denied: Device mismatch' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = router;