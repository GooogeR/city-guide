const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Импорт модели пользователя
const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    // Сохранение пользователя
    await newUser.save();
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
