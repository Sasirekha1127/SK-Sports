const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function run() {
    try {
        const hash = await bcrypt.hash('Admin_SkSports@@2026', 10);
        await db.query('UPDATE admin_users SET password = ? WHERE email = ?', [hash, 'admin@sksports.com']);
        console.log('Password updated.');
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
