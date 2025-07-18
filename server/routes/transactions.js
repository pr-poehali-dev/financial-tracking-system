const express = require('express');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

const router = express.Router();

// Получить все транзакции пользователя
router.get('/', async (req, res) => {
    try {
        const { limit, offset, startDate, endDate, categoryId, accountId } = req.query;
        
        const options = {
            limit: parseInt(limit) || 50,
            offset: parseInt(offset) || 0,
            startDate,
            endDate,
            categoryId: categoryId ? parseInt(categoryId) : null,
            accountId: accountId ? parseInt(accountId) : null
        };

        const transactions = await Transaction.findByUserId(req.user.id, options);
        res.json(transactions.map(transaction => transaction.toJSON()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить статистику по транзакциям
router.get('/stats', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const options = {
            startDate,
            endDate
        };

        const stats = await Transaction.getStatsByUserId(req.user.id, options);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить статистику по категориям
router.get('/category-stats', async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        
        const options = {
            startDate,
            endDate,
            type
        };

        const stats = await Transaction.getCategoryStats(req.user.id, options);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить транзакцию по ID
router.get('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({ error: 'Транзакция не найдена' });
        }

        if (transaction.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этой транзакции' });
        }

        res.json(transaction.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новую транзакцию
router.post('/', async (req, res) => {
    try {
        const { account_id, category_id, amount, description, type, date } = req.body;

        if (!account_id || !amount || !type || !date) {
            return res.status(400).json({ error: 'Обязательные поля: account_id, amount, type, date' });
        }

        // Проверяем, что счет принадлежит пользователю
        const account = await Account.findById(account_id);
        if (!account || account.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к указанному счету' });
        }

        const transactionData = {
            user_id: req.user.id,
            account_id,
            category_id,
            amount: parseFloat(amount),
            description,
            type,
            date
        };

        const transaction = await Transaction.create(transactionData);
        res.status(201).json(transaction.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить транзакцию
router.put('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({ error: 'Транзакция не найдена' });
        }

        if (transaction.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этой транзакции' });
        }

        const updatedTransaction = await transaction.update(req.body);
        res.json(updatedTransaction.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить транзакцию
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({ error: 'Транзакция не найдена' });
        }

        if (transaction.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этой транзакции' });
        }

        await transaction.delete();
        res.json({ message: 'Транзакция успешно удалена' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;