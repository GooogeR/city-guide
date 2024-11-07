const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Ссылка на пользователя
}, { timestamps: true });

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
