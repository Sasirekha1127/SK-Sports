const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function run() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                role VARCHAR(255),
                status VARCHAR(50),
                display_order INT
            )
        `);
        // Seed default admin
        const [rows] = await db.query('SELECT * FROM admin_users WHERE email = ?', ['admin@sksports.com']);
        if (rows.length === 0) {
            const hash = await bcrypt.hash('admin123', 10);
            await db.query('INSERT INTO admin_users (id, name, email, password, role, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)', ['default', 'Admin', 'admin@sksports.com', hash, 'Super Admin', 'active', 0]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
