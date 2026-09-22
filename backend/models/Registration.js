const db = require('../config/db');

class Registration {
    static async ensureColumns() {
        const cols = [
            'dob VARCHAR(50)',
            'sport VARCHAR(100)',
            'skill_level VARCHAR(100)',
            'training_time VARCHAR(100)',
            'message TEXT'
        ];
        for (const col of cols) {
            await db.query(`ALTER TABLE academy_registrations ADD COLUMN ${col}`).catch(() => {});
        }
    }

    static async create(data) {
        await Registration.ensureColumns();
        const { name, email, phone, gender, dob, sport, skill_level, training_time, message } = data;
        const [result] = await db.query(
            'INSERT INTO academy_registrations (name, email, phone, gender, dob, sport, skill_level, training_time, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                name,
                email || '',
                phone,
                gender || 'Not specified',
                dob || null,
                sport || 'Badminton',
                skill_level || 'Beginner',
                training_time || 'Flexible',
                message || ''
            ]
        );
        return result;
    }

    static async getAll() {
        await Registration.ensureColumns();
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
