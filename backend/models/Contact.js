const db = require('../config/db');

class Contact {
    static async create(data) {
        const { name, email, phone, age, message } = data;
        const [result] = await db.query(
            'INSERT INTO contact_messages (name, email, phone, age, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, age || null, message]
        );
        return result;
    }

    static async getAll() {
        const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        return rows.map(r => ({ ...r, createdAt: r.created_at, read: !!r.is_read }));
    }

    static async updateRead(id, is_read) {
        // We will try to update is_read. If the column doesn't exist, it might fail.
        // To be safe, we let's ensure the column exists. We can ignore it if it doesn't.
        try {
            await db.query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
        } catch (e) {
            // column might not exist yet, ignore
            if (e.code === 'ER_BAD_FIELD_ERROR') {
                await db.query('ALTER TABLE contact_messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE');
                await db.query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
            } else {
                throw e;
            }
        }
        return true;
    }

    static async remove(id) {
        await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Contact;
