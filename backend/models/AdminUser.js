const db = require('../config/db');
const bcrypt = require('bcryptjs');

class AdminUser {
    static async getAll() {
        const [rows] = await db.query('SELECT id, name, email, role, status, display_order FROM admin_users ORDER BY display_order ASC');
        return rows.map(r => ({ ...r, order: r.display_order }));
    }
    static async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
        return rows[0];
    }
    static async create(data) {
        const { id, name, email, role, status, order, password } = data;
        const passwordHash = await bcrypt.hash(password && password.trim() ? password.trim() : 'password123', 10);
        await db.query(
            'INSERT INTO admin_users (id, name, email, password, role, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id || Date.now().toString(), name, email, passwordHash, role || 'Super Admin', status || 'active', order || 0]
        );
        return { id: id || Date.now().toString() };
    }
    static async update(id, data) {
        const { name, email, role, status, order, password } = data;
        if (password && password.trim()) {
            const hash = await bcrypt.hash(password.trim(), 10);
            await db.query('UPDATE admin_users SET name=?, email=?, role=?, status=?, display_order=?, password=? WHERE id=?', [name, email, role, status, order, hash, id]);
        } else {
            await db.query('UPDATE admin_users SET name=?, email=?, role=?, status=?, display_order=? WHERE id=?', [name, email, role, status, order, id]);
        }
        return true;
    }
    static async changePassword(id, currentPassword, newPassword) {
        const [rows] = await db.query('SELECT * FROM admin_users WHERE id = ?', [id]);
        if (!rows.length) {
            throw new Error('Admin user not found');
        }
        const user = rows[0];
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            throw new Error('Current password does not match');
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE admin_users SET password = ? WHERE id = ?', [hash, id]);
        return true;
    }
    static async resetPassword(id, newPassword) {
        const [rows] = await db.query('SELECT * FROM admin_users WHERE id = ?', [id]);
        if (!rows.length) {
            throw new Error('Admin user not found');
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE admin_users SET password = ? WHERE id = ?', [hash, id]);
        return true;
    }
    static async remove(id) {
        await db.query('DELETE FROM admin_users WHERE id = ?', [id]);
        return true;
    }
}
module.exports = AdminUser;
