// filepath: backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth'); // JWT auth middleware

// Check if user has paid for a movie
router.get('/hasPaid/:movieId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      user: req.user.id,
      movie: req.params.movieId,
      status: 'paid'
    });
    res.json({ hasPaid: !!payment });
  } catch (err) {
    console.error(err); // Add this line
    res.status(500).json({ message: 'Server error' });
  }
});

// Pay for a movie (simulate payment)
router.post('/pay/:movieId', protect, async (req, res) => {
  try {
    // Optionally, check if already paid
    const alreadyPaid = await Payment.findOne({
      user: req.user.id,
      movie: req.params.movieId,
      status: 'paid'
    });
    if (alreadyPaid) {
      return res.json({ success: true, message: 'Already paid' });
    }

    // Optionally, check if movie exists
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Simulate payment success
    await Payment.create({
      user: req.user.id,
      movie: req.params.movieId,
      status: 'paid'
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err); // Add this line
    res.status(500).json({ message: 'Payment failed' });
  }
});

module.exports = router;