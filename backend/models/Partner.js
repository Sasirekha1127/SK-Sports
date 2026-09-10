const db = require('../config/db');

class Partner {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM partners ORDER BY display_order ASC, id ASC');
        return rows.map(r => ({ ...r, order: r.display_order }));
    }
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM partners WHERE id = ?', [id]);
        if(rows[0]) rows[0].order = rows[0].display_order;
        return rows[0];
    }
    static async create(data) {
        const { id, name, logo, status, order } = data;
        await db.query(
            'INSERT INTO partners (id, name, logo, status, display_order) VALUES (?, ?, ?, ?, ?)',
            [id || Date.now().toString(), name, logo, status, order || 0]
        );
        return { id };
    }
    static async update(id, data) {
        const { name, logo, status, order } = data;
        await db.query(
            'UPDATE partners SET name=?, logo=?, status=?, display_order = ? WHERE id = ?',
            [name, logo, status, order, id]
        );
        return true;
    }
    static async remove(id) {
        await db.query('DELETE FROM partners WHERE id = ?', [id]);
        return true;
    }
}
module.exports = Partner;
