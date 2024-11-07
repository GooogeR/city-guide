require('dotenv').config(); // Подключаем dotenv для загрузки переменных окружения

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const placeRoutes = require('./routes/places');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Подключение к MongoDB с использованием URI из переменной окружения
mongoose.connect(process.env.MONGODB_URI, {
  
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

// Роуты
app.use('/api', authRoutes);
app.use('/api/places', placeRoutes); // Регистрируем маршруты для объектов

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
