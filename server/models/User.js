const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/init');

class User {
    constructor(userData) {
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        this.password_hash = userData.password_hash;
        this.created_at = userData.created_at;
        this.updated_at = userData.updated_at;
    }

    static async create(userData) {
        const { username, email, password } = userData;
        
        // Хешируем пароль
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const sql = `
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `;

        try {
            const result = await db.run(sql, [username, email, password_hash]);
            const user = await this.findById(result.id);
            return user;
        } catch (error) {
            throw new Error('Ошибка создания пользователя: ' + error.message);
        }
    }

    static async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const userData = await db.get(sql, [id]);
        
        if (!userData) {
            return null;
        }

        return new User(userData);
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const userData = await db.get(sql, [email]);
        
        if (!userData) {
            return null;
        }

        return new User(userData);
    }

    static async findByUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const userData = await db.get(sql, [username]);
        
        if (!userData) {
            return null;
        }

        return new User(userData);
    }

    async validatePassword(password) {
        return await bcrypt.compare(password, this.password_hash);
    }

    generateToken() {
        return jwt.sign(
            { id: this.id, username: this.username, email: this.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = User;