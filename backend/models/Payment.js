const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  status: { type: String, default: 'paid' },
  paidAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);