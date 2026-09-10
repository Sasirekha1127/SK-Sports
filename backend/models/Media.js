const db = require('../config/db');

class Media {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM media ORDER BY uploadedAt DESC');
        return rows;
    }
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM media WHERE id = ?', [id]);
        return rows[0];
    }
    static async create(data) {
        const { id, name, url, folder } = data;
        await db.query(
            'INSERT INTO media (id, name, url, folder) VALUES (?, ?, ?, ?)',
            [id || Date.now().toString(), name, url, folder]
        );
        return { id };
    }
    static async update(id, data) {
        const { name, url, folder } = data;
        await db.query(
            'UPDATE media SET name = ?, url = ?, folder = ? WHERE id = ?',
            [name, url, folder, id]
        );
        return true;
    }
    static async remove(id) {
        await db.query('DELETE FROM media WHERE id = ?', [id]);
        return true;
    }
}
module.exports = Media;
