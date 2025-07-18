const db = require('../database/init');
const Account = require('./Account');

class Transaction {
    constructor(transactionData) {
        this.id = transactionData.id;
        this.user_id = transactionData.user_id;
        this.account_id = transactionData.account_id;
        this.category_id = transactionData.category_id;
        this.amount = parseFloat(transactionData.amount);
        this.description = transactionData.description;
        this.type = transactionData.type;
        this.date = transactionData.date;
        this.created_at = transactionData.created_at;
        this.updated_at = transactionData.updated_at;
    }

    static async create(transactionData) {
        const { user_id, account_id, category_id, amount, description, type, date } = transactionData;

        const sql = `
            INSERT INTO transactions (user_id, account_id, category_id, amount, description, type, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            // Начинаем транзакцию
            const result = await db.run(sql, [user_id, account_id, category_id, amount, description, type, date]);
            
            // Обновляем баланс счета
            const account = await Account.findById(account_id);
            if (account) {
                const balanceChange = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
                await account.updateBalance(balanceChange);
            }

            return await this.findById(result.id);
        } catch (error) {
            throw new Error('Ошибка создания транзакции: ' + error.message);
        }
    }

    static async findById(id) {
        const sql = `
            SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon,
                   a.name as account_name, a.type as account_type
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN accounts a ON t.account_id = a.id
            WHERE t.id = ?
        `;
        const transactionData = await db.get(sql, [id]);
        
        if (!transactionData) {
            return null;
        }

        return new Transaction(transactionData);
    }

    static async findByUserId(userId, options = {}) {
        const { limit = 50, offset = 0, startDate, endDate, categoryId, accountId } = options;
        
        let sql = `
            SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon,
                   a.name as account_name, a.type as account_type
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN accounts a ON t.account_id = a.id
            WHERE t.user_id = ?
        `;
        const params = [userId];

        if (startDate) {
            sql += ' AND t.date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            sql += ' AND t.date <= ?';
            params.push(endDate);
        }

        if (categoryId) {
            sql += ' AND t.category_id = ?';
            params.push(categoryId);
        }

        if (accountId) {
            sql += ' AND t.account_id = ?';
            params.push(accountId);
        }

        sql += ' ORDER BY t.date DESC, t.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const transactionsData = await db.all(sql, params);
        return transactionsData.map(data => new Transaction(data));
    }

    static async getStatsByUserId(userId, options = {}) {
        const { startDate, endDate } = options;
        
        let sql = `
            SELECT 
                type,
                SUM(amount) as total_amount,
                COUNT(*) as count
            FROM transactions 
            WHERE user_id = ?
        `;
        const params = [userId];

        if (startDate) {
            sql += ' AND date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            sql += ' AND date <= ?';
            params.push(endDate);
        }

        sql += ' GROUP BY type';

        const stats = await db.all(sql, params);
        
        const result = {
            income: 0,
            expense: 0,
            total_transactions: 0
        };

        stats.forEach(stat => {
            result[stat.type] = parseFloat(stat.total_amount);
            result.total_transactions += stat.count;
        });

        result.net_income = result.income - result.expense;
        
        return result;
    }

    static async getCategoryStats(userId, options = {}) {
        const { startDate, endDate, type } = options;
        
        let sql = `
            SELECT 
                c.name as category_name,
                c.color as category_color,
                c.icon as category_icon,
                SUM(t.amount) as total_amount,
                COUNT(t.id) as count
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ?
        `;
        const params = [userId];

        if (startDate) {
            sql += ' AND t.date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            sql += ' AND t.date <= ?';
            params.push(endDate);
        }

        if (type) {
            sql += ' AND t.type = ?';
            params.push(type);
        }

        sql += ' GROUP BY t.category_id, c.name ORDER BY total_amount DESC';

        const stats = await db.all(sql, params);
        return stats.map(stat => ({
            category_name: stat.category_name || 'Без категории',
            category_color: stat.category_color || '#6B7280',
            category_icon: stat.category_icon || 'Circle',
            total_amount: parseFloat(stat.total_amount),
            count: stat.count
        }));
    }

    async update(updates) {
        const allowedFields = ['category_id', 'amount', 'description', 'type', 'date'];
        const fields = [];
        const values = [];
        const oldAmount = this.amount;
        const oldType = this.type;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            throw new Error('Нет полей для обновления');
        }

        values.push(new Date().toISOString());
        fields.push('updated_at = ?');
        values.push(this.id);

        const sql = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`;

        try {
            await db.run(sql, values);
            
            // Обновляем баланс счета
            const account = await Account.findById(this.account_id);
            if (account) {
                // Отменяем старую транзакцию
                const oldBalanceChange = oldType === 'expense' ? Math.abs(oldAmount) : -Math.abs(oldAmount);
                await account.updateBalance(oldBalanceChange);
                
                // Применяем новую транзакцию
                const newType = updates.type || this.type;
                const newAmount = updates.amount || this.amount;
                const newBalanceChange = newType === 'expense' ? -Math.abs(newAmount) : Math.abs(newAmount);
                await account.updateBalance(newBalanceChange);
            }

            return await Transaction.findById(this.id);
        } catch (error) {
            throw new Error('Ошибка обновления транзакции: ' + error.message);
        }
    }

    async delete() {
        try {
            // Отменяем изменение баланса
            const account = await Account.findById(this.account_id);
            if (account) {
                const balanceChange = this.type === 'expense' ? Math.abs(this.amount) : -Math.abs(this.amount);
                await account.updateBalance(balanceChange);
            }

            const sql = 'DELETE FROM transactions WHERE id = ?';
            await db.run(sql, [this.id]);
            
            return true;
        } catch (error) {
            throw new Error('Ошибка удаления транзакции: ' + error.message);
        }
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            account_id: this.account_id,
            category_id: this.category_id,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: this.date,
            created_at: this.created_at,
            updated_at: this.updated_at,
            // Дополнительная информация из JOIN
            category_name: this.category_name,
            category_color: this.category_color,
            category_icon: this.category_icon,
            account_name: this.account_name,
            account_type: this.account_type
        };
    }
}

module.exports = Transaction;