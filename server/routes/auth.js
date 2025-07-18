const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Проверяем, существует ли пользователь
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
        }

        // Создаем нового пользователя
        const user = await User.create({ username, email, password });
        const token = user.generateToken();

        res.status(201).json({
            message: 'Пользователь успешно создан',
            user: user.toJSON(),
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Авторизация
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ищем пользователя по email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        // Проверяем пароль
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = user.generateToken();

        res.json({
            message: 'Авторизация успешна',
            user: user.toJSON(),
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение текущего пользователя
router.get('/me', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json(user.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;