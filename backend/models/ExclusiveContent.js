const mongoose = require('mongoose');

const exclusiveContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('ExclusiveContent', exclusiveContentSchema);