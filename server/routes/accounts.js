const express = require('express');
const Account = require('../models/Account');

const router = express.Router();

// Получить все счета пользователя
router.get('/', async (req, res) => {
    try {
        const accounts = await Account.findByUserId(req.user.id);
        res.json(accounts.map(account => account.toJSON()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить счет по ID
router.get('/:id', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        
        if (!account) {
            return res.status(404).json({ error: 'Счет не найден' });
        }

        if (account.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этому счету' });
        }

        res.json(account.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый счет
router.post('/', async (req, res) => {
    try {
        const { name, type, balance, currency, credit_limit } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'Название и тип счета обязательны' });
        }

        const accountData = {
            user_id: req.user.id,
            name,
            type,
            balance: balance || 0,
            currency: currency || 'RUB',
            credit_limit: credit_limit || 0
        };

        const account = await Account.create(accountData);
        res.status(201).json(account.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить счет
router.put('/:id', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        
        if (!account) {
            return res.status(404).json({ error: 'Счет не найден' });
        }

        if (account.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этому счету' });
        }

        const updatedAccount = await account.update(req.body);
        res.json(updatedAccount.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить счет (деактивировать)
router.delete('/:id', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        
        if (!account) {
            return res.status(404).json({ error: 'Счет не найден' });
        }

        if (account.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Нет доступа к этому счету' });
        }

        await account.delete();
        res.json({ message: 'Счет успешно удален' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;