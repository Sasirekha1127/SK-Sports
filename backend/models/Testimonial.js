const db = require('../config/db');

class Testimonial {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM testimonials ORDER BY display_order ASC, id ASC');
        return rows.map(r => ({ ...r, order: r.display_order }));
    }
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
        if (rows[0]) rows[0].order = rows[0].display_order;
        return rows[0];
    }
    static async create(data) {
        const { id, name, role, quote, image, status, order, side_image_1, side_image_2 } = data;
        await db.query(
            'INSERT INTO testimonials (id, name, role, quote, image, status, display_order, side_image_1, side_image_2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id || Date.now().toString(), name, role, quote || null, image || null, status || 'published', order || 0, side_image_1 || null, side_image_2 || null]
        );
        return { id };
    }
    static async update(id, data) {
        const { name, role, quote, image, status, order, side_image_1, side_image_2 } = data;
        await db.query(
            'UPDATE testimonials SET name = ?, role = ?, quote = ?, image = ?, status = ?, display_order = ?, side_image_1 = ?, side_image_2 = ? WHERE id = ?',
            [name, role, quote, image, status, order, side_image_1 || null, side_image_2 || null, id]
        );
        return true;
    }
    static async remove(id) {
        await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
        return true;
    }
}
module.exports = Testimonial;
