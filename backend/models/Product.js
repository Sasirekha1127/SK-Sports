const db = require('../config/db');

class Product {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM products ORDER BY display_order ASC, id ASC');
        return rows.map(r => ({ ...r, order: r.display_order }));
    }
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if(rows[0]) rows[0].order = rows[0].display_order;
        return rows[0];
    }
    static async create(data) {
        const { id, title, category, price, salePrice, image, status, order } = data;
        await db.query(
            'INSERT INTO products (id, title, category, price, salePrice, image, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id || Date.now().toString(), title, category, price, salePrice, image, status, order || 0]
        );
        return { id };
    }
    static async update(id, data) {
        const { title, category, price, salePrice, image, status, order } = data;
        await db.query(
            'UPDATE products SET title=?, category=?, price=?, salePrice=?, image=?, status=?, display_order = ? WHERE id = ?',
            [title, category, price, salePrice, image, status, order, id]
        );
        return true;
    }
    static async remove(id) {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        return true;
    }
}
module.exports = Product;
