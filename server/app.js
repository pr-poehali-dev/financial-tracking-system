const express = require('express');
const cors = require('cors');
const path = require('path');

// Импортируем middleware
const authenticateToken = require('./middleware/auth');

// Импортируем маршруты
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const creditRoutes = require('./routes/credits');
const workShiftRoutes = require('./routes/work-shifts');

// Инициализируем базу данных
require('./database/init');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Публичные маршруты
app.use('/api/auth', authRoutes);

// Защищенные маршруты
app.use('/api/accounts', authenticateToken, accountRoutes);
app.use('/api/transactions', authenticateToken, transactionRoutes);
app.use('/api/credits', authenticateToken, creditRoutes);
app.use('/api/work-shifts', authenticateToken, workShiftRoutes);

// Статические файлы фронтенда
app.use(express.static(path.join(__dirname, '../dist')));

// Обработка SPA маршрутов
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 Фронтенд: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
});

module.exports = app;