const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const Place = require('../models/Place'); // Модель для объектов
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = '1h'; // Время жизни access токена
const JWT_REFRESH_EXPIRES_IN = '30d'; // Время жизни refresh токена

// Настройка multer для хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Создать директорию, если её нет
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const filename = Date.now() + fileExtension; // Уникальное имя для каждого файла
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Генерация токенов (Access и Refresh)
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
};

// Регистрация пользователя
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

    // Генерация токенов и ответ пользователю
    const { accessToken, refreshToken } = generateTokens(newUser._id);
    const newRefreshToken = new RefreshToken({ userId: newUser._id, token: refreshToken });
    await newRefreshToken.save();

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', accessToken, refreshToken });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
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

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Сохранение refresh токена в базе данных
    await RefreshToken.deleteMany({ userId: user._id }); // Удаление устаревших токенов
    const newRefreshToken = new RefreshToken({ userId: user._id, token: refreshToken });
    await newRefreshToken.save();

    res.json({ accessToken, refreshToken, userId: user._id });
  } catch (error) {
    console.error('Ошибка при логине:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновление токенов
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Нет refresh токена' });
  }

  try {
    // Проверка refresh токена
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const storedToken = await RefreshToken.findOne({ userId: decoded.userId, token: refreshToken });

    if (!storedToken) {
      return res.status(403).json({ message: 'Неверный refresh токен' });
    }

    // Генерация нового access токена
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    // Обновление refresh токена в базе данных
    await RefreshToken.deleteOne({ token: refreshToken }); // Удаление старого токена
    const newStoredToken = new RefreshToken({ userId: decoded.userId, token: newRefreshToken });
    await newStoredToken.save();

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Ошибка при обновлении токенов:', error);
    res.status(401).json({ message: 'Ошибка при обновлении токенов', error: error.message });
  }
});

// Маршрут для добавления нового объекта
router.post('/places', upload.single('image'), async (req, res) => {
  try {
    const { name, description, location, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ''; // Путь к загруженному изображению

    // Создание нового объекта
    const newPlace = new Place({
      name,
      description,
      location,
      category,
      image
    });

    await newPlace.save();
    res.status(201).json({ message: 'Объект успешно добавлен', place: newPlace });
  } catch (error) {
    console.error('Ошибка при добавлении объекта:', error);
    res.status(500).json({ message: 'Ошибка сервера при добавлении объекта' });
  }
});

// Получение списка объектов
router.get('/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json({ places });
  } catch (error) {
    console.error('Ошибка при получении объектов:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении объектов' });
  }
});

module.exports = router;
