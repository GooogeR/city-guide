const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String } // Путь к изображению
});

module.exports = mongoose.model('Place', placeSchema);
