const express = require('express');
const router = express.Router();
const ExclusiveContent = require('../models/ExclusiveContent');

// Get all exclusive content
router.get('/', async (req, res) => {
  try {
    const content = await ExclusiveContent.find().sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// (Optional) Add new exclusive content (for admin use)
router.post('/', async (req, res) => {
  try {
    const newContent = new ExclusiveContent(req.body);
    await newContent.save();
    res.status(201).json(newContent);
  } catch (error) {
    res.status(400).json({ message: 'Error adding content', error: error.message });
  }
});

module.exports = router;