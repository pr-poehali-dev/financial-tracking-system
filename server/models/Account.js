const db = require('../database/init');

class Account {
    constructor(accountData) {
        this.id = accountData.id;
        this.user_id = accountData.user_id;
        this.name = accountData.name;
        this.type = accountData.type;
        this.balance = parseFloat(accountData.balance);
        this.currency = accountData.currency;
        this.credit_limit = parseFloat(accountData.credit_limit || 0);
        this.is_active = accountData.is_active;
        this.created_at = accountData.created_at;
        this.updated_at = accountData.updated_at;
    }

    static async create(accountData) {
        const { user_id, name, type, balance = 0, currency = 'RUB', credit_limit = 0 } = accountData;

        const sql = `
            INSERT INTO accounts (user_id, name, type, balance, currency, credit_limit)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        try {
            const result = await db.run(sql, [user_id, name, type, balance, currency, credit_limit]);
            return await this.findById(result.id);
        } catch (error) {
            throw new Error('Ошибка создания счета: ' + error.message);
        }
    }

    static async findById(id) {
        const sql = 'SELECT * FROM accounts WHERE id = ?';
        const accountData = await db.get(sql, [id]);
        
        if (!accountData) {
            return null;
        }

        return new Account(accountData);
    }

    static async findByUserId(userId) {
        const sql = 'SELECT * FROM accounts WHERE user_id = ? AND is_active = TRUE ORDER BY created_at DESC';
        const accountsData = await db.all(sql, [userId]);
        
        return accountsData.map(data => new Account(data));
    }

    async update(updates) {
        const allowedFields = ['name', 'type', 'balance', 'currency', 'credit_limit'];
        const fields = [];
        const values = [];

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

        const sql = `UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`;

        try {
            await db.run(sql, values);
            return await Account.findById(this.id);
        } catch (error) {
            throw new Error('Ошибка обновления счета: ' + error.message);
        }
    }

    async updateBalance(amount) {
        const newBalance = this.balance + amount;
        
        const sql = 'UPDATE accounts SET balance = ?, updated_at = ? WHERE id = ?';
        await db.run(sql, [newBalance, new Date().toISOString(), this.id]);
        
        this.balance = newBalance;
        return this;
    }

    async delete() {
        const sql = 'UPDATE accounts SET is_active = FALSE, updated_at = ? WHERE id = ?';
        await db.run(sql, [new Date().toISOString(), this.id]);
        
        this.is_active = false;
        return this;
    }

    getAvailableBalance() {
        if (this.type === 'credit') {
            return this.credit_limit + this.balance; // balance отрицательный для кредитных карт
        }
        return this.balance;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            type: this.type,
            balance: this.balance,
            currency: this.currency,
            credit_limit: this.credit_limit,
            available_balance: this.getAvailableBalance(),
            is_active: this.is_active,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = Account;