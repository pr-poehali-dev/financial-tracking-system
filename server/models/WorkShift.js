const db = require('../database/init');

class WorkShift {
    constructor(shiftData) {
        this.id = shiftData.id;
        this.user_id = shiftData.user_id;
        this.date = shiftData.date;
        this.hours = parseFloat(shiftData.hours);
        this.hourly_rate = parseFloat(shiftData.hourly_rate);
        this.bonus = parseFloat(shiftData.bonus || 0);
        this.advance = parseFloat(shiftData.advance || 0);
        this.deduction = parseFloat(shiftData.deduction || 0);
        this.notes = shiftData.notes;
        this.status = shiftData.status;
        this.created_at = shiftData.created_at;
        this.updated_at = shiftData.updated_at;
    }

    static async create(shiftData) {
        const { 
            user_id, date, hours, hourly_rate, bonus = 0, 
            advance = 0, deduction = 0, notes, status = 'planned' 
        } = shiftData;

        const sql = `
            INSERT INTO work_shifts (
                user_id, date, hours, hourly_rate, bonus, advance, deduction, notes, status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            const result = await db.run(sql, [
                user_id, date, hours, hourly_rate, bonus, advance, deduction, notes, status
            ]);
            return await this.findById(result.id);
        } catch (error) {
            throw new Error('Ошибка создания смены: ' + error.message);
        }
    }

    static async findById(id) {
        const sql = 'SELECT * FROM work_shifts WHERE id = ?';
        const shiftData = await db.get(sql, [id]);
        
        if (!shiftData) {
            return null;
        }

        return new WorkShift(shiftData);
    }

    static async findByUserId(userId, options = {}) {
        const { startDate, endDate, status, limit = 100, offset = 0 } = options;
        
        let sql = 'SELECT * FROM work_shifts WHERE user_id = ?';
        const params = [userId];

        if (startDate) {
            sql += ' AND date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            sql += ' AND date <= ?';
            params.push(endDate);
        }

        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }

        sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const shiftsData = await db.all(sql, params);
        return shiftsData.map(data => new WorkShift(data));
    }

    static async getStatsByUserId(userId, options = {}) {
        const { startDate, endDate, status } = options;
        
        let sql = `
            SELECT 
                COUNT(*) as total_shifts,
                SUM(hours) as total_hours,
                SUM(bonus) as total_bonus,
                SUM(advance) as total_advance,
                SUM(deduction) as total_deduction,
                AVG(hourly_rate) as avg_hourly_rate,
                status
            FROM work_shifts 
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

        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }

        sql += ' GROUP BY status';

        const stats = await db.all(sql, params);
        
        const result = {
            total_shifts: 0,
            total_hours: 0,
            total_bonus: 0,
            total_advance: 0,
            total_deduction: 0,
            avg_hourly_rate: 0,
            total_earnings: 0,
            net_earnings: 0,
            by_status: {}
        };

        stats.forEach(stat => {
            result.total_shifts += stat.total_shifts;
            result.total_hours += stat.total_hours || 0;
            result.total_bonus += stat.total_bonus || 0;
            result.total_advance += stat.total_advance || 0;
            result.total_deduction += stat.total_deduction || 0;
            result.avg_hourly_rate = stat.avg_hourly_rate || 0;
            
            result.by_status[stat.status] = {
                shifts: stat.total_shifts,
                hours: stat.total_hours || 0,
                bonus: stat.total_bonus || 0,
                advance: stat.total_advance || 0,
                deduction: stat.total_deduction || 0
            };
        });

        result.total_earnings = (result.total_hours * result.avg_hourly_rate) + result.total_bonus;
        result.net_earnings = result.total_earnings - result.total_advance - result.total_deduction;

        return result;
    }

    static async getCalendarData(userId, year, month) {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
        
        const sql = `
            SELECT * FROM work_shifts 
            WHERE user_id = ? AND date >= ? AND date <= ?
            ORDER BY date ASC
        `;
        
        const shifts = await db.all(sql, [userId, startDate, endDate]);
        return shifts.map(data => new WorkShift(data));
    }

    async update(updates) {
        const allowedFields = [
            'date', 'hours', 'hourly_rate', 'bonus', 'advance', 'deduction', 'notes', 'status'
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

        const sql = `UPDATE work_shifts SET ${fields.join(', ')} WHERE id = ?`;

        try {
            await db.run(sql, values);
            return await WorkShift.findById(this.id);
        } catch (error) {
            throw new Error('Ошибка обновления смены: ' + error.message);
        }
    }

    async delete() {
        const sql = 'DELETE FROM work_shifts WHERE id = ?';
        await db.run(sql, [this.id]);
        return true;
    }

    // Расчет итоговой суммы за смену
    calculateTotal() {
        const baseEarnings = this.hours * this.hourly_rate;
        return baseEarnings + this.bonus - this.advance - this.deduction;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            date: this.date,
            hours: this.hours,
            hourly_rate: this.hourly_rate,
            bonus: this.bonus,
            advance: this.advance,
            deduction: this.deduction,
            notes: this.notes,
            status: this.status,
            total: this.calculateTotal(),
            base_earnings: this.hours * this.hourly_rate,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = WorkShift;