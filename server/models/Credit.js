const db = require('../database/init');

class Credit {
    constructor(creditData) {
        this.id = creditData.id;
        this.user_id = creditData.user_id;
        this.name = creditData.name;
        this.type = creditData.type;
        this.total_amount = parseFloat(creditData.total_amount);
        this.remaining_amount = parseFloat(creditData.remaining_amount);
        this.monthly_payment = parseFloat(creditData.monthly_payment);
        this.interest_rate = parseFloat(creditData.interest_rate);
        this.start_date = creditData.start_date;
        this.end_date = creditData.end_date;
        this.next_payment_date = creditData.next_payment_date;
        this.is_active = creditData.is_active;
        this.created_at = creditData.created_at;
        this.updated_at = creditData.updated_at;
    }

    static async create(creditData) {
        const { 
            user_id, name, type, total_amount, remaining_amount, 
            monthly_payment, interest_rate, start_date, end_date, next_payment_date 
        } = creditData;

        const sql = `
            INSERT INTO credits (
                user_id, name, type, total_amount, remaining_amount, 
                monthly_payment, interest_rate, start_date, end_date, next_payment_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            const result = await db.run(sql, [
                user_id, name, type, total_amount, remaining_amount || total_amount,
                monthly_payment, interest_rate, start_date, end_date, next_payment_date
            ]);
            return await this.findById(result.id);
        } catch (error) {
            throw new Error('Ошибка создания кредита: ' + error.message);
        }
    }

    static async findById(id) {
        const sql = 'SELECT * FROM credits WHERE id = ?';
        const creditData = await db.get(sql, [id]);
        
        if (!creditData) {
            return null;
        }

        return new Credit(creditData);
    }

    static async findByUserId(userId) {
        const sql = 'SELECT * FROM credits WHERE user_id = ? AND is_active = TRUE ORDER BY created_at DESC';
        const creditsData = await db.all(sql, [userId]);
        
        return creditsData.map(data => new Credit(data));
    }

    async update(updates) {
        const allowedFields = [
            'name', 'type', 'total_amount', 'remaining_amount', 
            'monthly_payment', 'interest_rate', 'start_date', 'end_date', 'next_payment_date'
        ];
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

        const sql = `UPDATE credits SET ${fields.join(', ')} WHERE id = ?`;

        try {
            await db.run(sql, values);
            return await Credit.findById(this.id);
        } catch (error) {
            throw new Error('Ошибка обновления кредита: ' + error.message);
        }
    }

    async makePayment(paymentAmount) {
        const monthlyRate = this.interest_rate / 100 / 12;
        const interestAmount = this.remaining_amount * monthlyRate;
        const principalAmount = paymentAmount - interestAmount;

        // Записываем платеж
        const paymentSql = `
            INSERT INTO credit_payments (credit_id, amount, principal_amount, interest_amount, payment_date)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        await db.run(paymentSql, [
            this.id, paymentAmount, principalAmount, interestAmount, new Date().toISOString().split('T')[0]
        ]);

        // Обновляем остаток кредита
        const newRemainingAmount = Math.max(0, this.remaining_amount - principalAmount);
        const nextPaymentDate = new Date(this.next_payment_date);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

        const updateSql = `
            UPDATE credits 
            SET remaining_amount = ?, next_payment_date = ?, updated_at = ?
            WHERE id = ?
        `;
        
        await db.run(updateSql, [
            newRemainingAmount, 
            nextPaymentDate.toISOString().split('T')[0], 
            new Date().toISOString(), 
            this.id
        ]);

        this.remaining_amount = newRemainingAmount;
        this.next_payment_date = nextPaymentDate.toISOString().split('T')[0];

        return this;
    }

    async getPaymentHistory() {
        const sql = `
            SELECT * FROM credit_payments 
            WHERE credit_id = ? 
            ORDER BY payment_date DESC
        `;
        
        return await db.all(sql, [this.id]);
    }

    async delete() {
        const sql = 'UPDATE credits SET is_active = FALSE, updated_at = ? WHERE id = ?';
        await db.run(sql, [new Date().toISOString(), this.id]);
        
        this.is_active = false;
        return this;
    }

    // Расчет статистики по кредиту
    calculateStats() {
        const monthlyRate = this.interest_rate / 100 / 12;
        const paidAmount = this.total_amount - this.remaining_amount;
        const progress = (paidAmount / this.total_amount) * 100;
        
        // Примерное количество оставшихся месяцев
        const remainingMonths = Math.ceil(this.remaining_amount / this.monthly_payment);
        
        // Переплата за оставшийся период
        const remainingInterest = (this.monthly_payment * remainingMonths) - this.remaining_amount;
        
        // Ежемесячные проценты и основной долг
        const monthlyInterest = this.remaining_amount * monthlyRate;
        const monthlyPrincipal = this.monthly_payment - monthlyInterest;

        return {
            paidAmount,
            progress,
            remainingMonths,
            remainingInterest,
            monthlyInterest,
            monthlyPrincipal,
            totalInterest: remainingInterest + (paidAmount * (this.interest_rate / 100)) // Приблизительно
        };
    }

    toJSON() {
        const stats = this.calculateStats();
        
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            type: this.type,
            total_amount: this.total_amount,
            remaining_amount: this.remaining_amount,
            monthly_payment: this.monthly_payment,
            interest_rate: this.interest_rate,
            start_date: this.start_date,
            end_date: this.end_date,
            next_payment_date: this.next_payment_date,
            is_active: this.is_active,
            created_at: this.created_at,
            updated_at: this.updated_at,
            stats
        };
    }
}

module.exports = Credit;