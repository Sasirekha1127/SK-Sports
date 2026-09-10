const db = require('../config/db');

class Registration {
    static async create(data) {
        const { name, email, phone, gender } = data;
        const [result] = await db.query(
            'INSERT INTO academy_registrations (name, email, phone, gender) VALUES (?, ?, ?, ?)',
            [name, email, phone, gender]
        );
        return result;
    }

    static async getAll() {
        const [rows] = await db.query('SELECT * FROM academy_registrations ORDER BY created_at DESC');
        return rows.map(r => ({ ...r, createdAt: r.created_at, read: !!r.is_read }));
    }

    static async updateRead(id, is_read) {
        try {
            await db.query('UPDATE academy_registrations SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
        } catch (e) {
            if (e.code === 'ER_BAD_FIELD_ERROR') {
                await db.query('ALTER TABLE academy_registrations ADD COLUMN is_read BOOLEAN DEFAULT FALSE');
                await db.query('UPDATE academy_registrations SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
            } else throw e;
        }
        return true;
    }

    static async remove(id) {
        await db.query('DELETE FROM academy_registrations WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Registration;
