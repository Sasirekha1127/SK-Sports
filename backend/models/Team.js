const db = require('../config/db');

class Team {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM team ORDER BY display_order ASC, id ASC');
        return rows.map(r => ({ ...r, order: r.display_order }));
    }
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM team WHERE id = ?', [id]);
        if (rows[0]) {
            rows[0].order = rows[0].display_order;
        }
        return rows[0];
    }
    static async create(data) {
        const { id, name, role, about, image, facebook, instagram, status, order } = data;
        await db.query(
            'INSERT INTO team (id, name, role, about, image, facebook, instagram, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id || Date.now().toString(), name, role, about || null, image || null, facebook || null, instagram || null, status || 'active', order || 0]
        );
        return { id };
    }
    static async update(id, data) {
        const { name, role, about, image, facebook, instagram, status, order } = data;
        await db.query(
            'UPDATE team SET name = ?, role = ?, about = ?, image = ?, facebook = ?, instagram = ?, status = ?, display_order = ? WHERE id = ?',
            [name, role, about || null, image, facebook, instagram, status, order, id]
        );
        return true;
    }
    static async remove(id) {
        await db.query('DELETE FROM team WHERE id = ?', [id]);
        return true;
    }
}
module.exports = Team;
