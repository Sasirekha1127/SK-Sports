const db = require('../config/db');

class Navigation {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM navigation ORDER BY display_order ASC, id ASC');
        return rows.map(r => ({ ...r, order: r.display_order }));
    }
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM navigation WHERE id = ?', [id]);
        if(rows[0]) rows[0].order = rows[0].display_order;
        return rows[0];
    }
    static async create(data) {
        const { id, label, url, enabled, order } = data;
        await db.query(
            'INSERT INTO navigation (id, label, url, enabled, display_order) VALUES (?, ?, ?, ?, ?)',
            [id || Date.now().toString(), label, url, enabled, order || 0]
        );
        return { id };
    }
    static async update(id, data) {
        const { label, url, enabled, order } = data;
        await db.query(
            'UPDATE navigation SET label=?, url=?, enabled=?, display_order = ? WHERE id = ?',
            [label, url, enabled, order, id]
        );
        return true;
    }
    static async remove(id) {
        await db.query('DELETE FROM navigation WHERE id = ?', [id]);
        return true;
    }
}
module.exports = Navigation;
