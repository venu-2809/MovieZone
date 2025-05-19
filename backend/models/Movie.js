const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  rating: Number,
  genre: String,
  year: Number,
  duration: String,
  description: String,
  director: String,
  cast: [String],
  movieUrl: String
});

module.exports = mongoose.model('Movie', movieSchema);