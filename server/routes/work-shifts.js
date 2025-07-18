const express = require('express');
const WorkShift = require('../models/WorkShift');

const router = express.Router();

// Получить все смены пользователя
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, status, limit, offset } = req.query;
        
        const options = {
            startDate,
            endDate,
            status,
            limit: parseInt(limit) || 100,
            offset: parseInt(offset) || 0
        };

        const shifts = await WorkShift.findByUserId(req.user.id, options);
        res.json(shifts.map(shift => shift.toJSON()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить статистику по сменам
router.get('/stats', async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;
        
        const options = {
            startDate,
            endDate,
            status
        };

        const stats = await WorkShift.getStatsByUserId(req.user.id, options);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить данные календаря
router.get('/calendar/:year/:month', async (req, res) => {
    try {
        const { year, month } = req.params;
        
        const shifts = await WorkShift.getCalendarData(req.user.id, parseInt(year), parseInt(month));
        res.json(shifts.map(shift => shift.toJSON()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить смену по ID
router.get('/:id', async (req, res) => {
    try {
        const shift = await WorkShift.findById(req.params.id);
        
        if (!shift) {
            return res.status(404).json({ error: 'Смена не найдена' });
        }

        if (shift.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этой смене' });
        }

        res.json(shift.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новую смену
router.post('/', async (req, res) => {
    try {
        const { 
            date, hours, hourly_rate, bonus, advance, deduction, notes, status 
        } = req.body;

        if (!date || !hours || !hourly_rate) {
            return res.status(400).json({ 
                error: 'Обязательные поля: date, hours, hourly_rate' 
            });
        }

        const shiftData = {
            user_id: req.user.id,
            date,
            hours: parseFloat(hours),
            hourly_rate: parseFloat(hourly_rate),
            bonus: bonus ? parseFloat(bonus) : 0,
            advance: advance ? parseFloat(advance) : 0,
            deduction: deduction ? parseFloat(deduction) : 0,
            notes,
            status: status || 'planned'
        };

        const shift = await WorkShift.create(shiftData);
        res.status(201).json(shift.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить смену
router.put('/:id', async (req, res) => {
    try {
        const shift = await WorkShift.findById(req.params.id);
        
        if (!shift) {
            return res.status(404).json({ error: 'Смена не найдена' });
        }

        if (shift.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этой смене' });
        }

        const updatedShift = await shift.update(req.body);
        res.json(updatedShift.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить смену
router.delete('/:id', async (req, res) => {
    try {
        const shift = await WorkShift.findById(req.params.id);
        
        if (!shift) {
            return res.status(404).json({ error: 'Смена не найдена' });
        }

        if (shift.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этой смене' });
        }

        await shift.delete();
        res.json({ message: 'Смена успешно удалена' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;