const express = require('express');
const Credit = require('../models/Credit');

const router = express.Router();

// Получить все кредиты пользователя
router.get('/', async (req, res) => {
    try {
        const credits = await Credit.findByUserId(req.user.id);
        res.json(credits.map(credit => credit.toJSON()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить кредит по ID
router.get('/:id', async (req, res) => {
    try {
        const credit = await Credit.findById(req.params.id);
        
        if (!credit) {
            return res.status(404).json({ error: 'Кредит не найден' });
        }

        if (credit.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этому кредиту' });
        }

        res.json(credit.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый кредит
router.post('/', async (req, res) => {
    try {
        const { 
            name, type, total_amount, remaining_amount, 
            monthly_payment, interest_rate, start_date, end_date, next_payment_date 
        } = req.body;

        if (!name || !type || !total_amount || !monthly_payment || !interest_rate || !start_date || !end_date) {
            return res.status(400).json({ 
                error: 'Обязательные поля: name, type, total_amount, monthly_payment, interest_rate, start_date, end_date' 
            });
        }

        const creditData = {
            user_id: req.user.id,
            name,
            type,
            total_amount: parseFloat(total_amount),
            remaining_amount: remaining_amount ? parseFloat(remaining_amount) : parseFloat(total_amount),
            monthly_payment: parseFloat(monthly_payment),
            interest_rate: parseFloat(interest_rate),
            start_date,
            end_date,
            next_payment_date: next_payment_date || new Date().toISOString().split('T')[0]
        };

        const credit = await Credit.create(creditData);
        res.status(201).json(credit.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить кредит
router.put('/:id', async (req, res) => {
    try {
        const credit = await Credit.findById(req.params.id);
        
        if (!credit) {
            return res.status(404).json({ error: 'Кредит не найден' });
        }

        if (credit.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этому кредиту' });
        }

        const updatedCredit = await credit.update(req.body);
        res.json(updatedCredit.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Сделать платеж по кредиту
router.post('/:id/payment', async (req, res) => {
    try {
        const credit = await Credit.findById(req.params.id);
        
        if (!credit) {
            return res.status(404).json({ error: 'Кредит не найден' });
        }

        if (credit.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этому кредиту' });
        }

        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Сумма платежа должна быть больше 0' });
        }

        const updatedCredit = await credit.makePayment(parseFloat(amount));
        res.json(updatedCredit.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить историю платежей по кредиту
router.get('/:id/payments', async (req, res) => {
    try {
        const credit = await Credit.findById(req.params.id);
        
        if (!credit) {
            return res.status(404).json({ error: 'Кредит не найден' });
        }

        if (credit.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этому кредиту' });
        }

        const payments = await credit.getPaymentHistory();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить кредит (деактивировать)
router.delete('/:id', async (req, res) => {
    try {
        const credit = await Credit.findById(req.params.id);
        
        if (!credit) {
            return res.status(404).json({ error: 'Кредит не найден' });
        }

        if (credit.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этому кредиту' });
        }

        await credit.delete();
        res.json({ message: 'Кредит успешно удален' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;