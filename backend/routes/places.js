const express = require('express');
const multer = require('multer');
const path = require('path');
const Place = require('../models/Place');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Папка для хранения изображений
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени для файла
  }
});

const upload = multer({ storage });

// Получение всех объектов пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    const places = await Place.find({ user: req.user.userId });
    res.json({ places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при загрузке объектов' });
  }
});

// Добавление нового объекта
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { name, description, location } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Путь к изображению

  try {
    const newPlace = new Place({
      name,
      description,
      location,
      user: req.user.userId,
      image: imagePath, // Сохраняем путь к изображению
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось добавить объект' });
  }
});

module.exports = router;
