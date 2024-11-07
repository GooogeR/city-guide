const express = require('express');
const Place = require('../models/Place');
const authMiddleware = require('../middleware/auth'); // middleware для проверки авторизации

const router = express.Router();

// Получение всех объектов пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Ищем все объекты, связанные с текущим пользователем
    const places = await Place.find({ user: req.user.id });
    res.json({ places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при загрузке объектов' });
  }
});

// Добавление нового объекта
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, location } = req.body;

  // Проверяем, что все обязательные поля присутствуют в запросе
  if (!name || !description || !location) {
    return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
  }

  try {
    const newPlace = new Place({
      name,
      description,
      location,
      user: req.user.id // Связываем объект с пользователем
    });

    // Сохраняем объект в базе данных
    await newPlace.save();
    res.status(201).json(newPlace); // Возвращаем добавленный объект
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось добавить объект' });
  }
});

module.exports = router;
