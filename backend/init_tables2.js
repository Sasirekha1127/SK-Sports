const db = require('./config/db');

async function run() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(255),
                price VARCHAR(50),
                salePrice VARCHAR(50),
                image LONGTEXT,
                status VARCHAR(50),
                display_order INT
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS partners (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                logo LONGTEXT,
                status VARCHAR(50),
                display_order INT
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS navigation (
                id VARCHAR(255) PRIMARY KEY,
                label VARCHAR(255) NOT NULL,
                url VARCHAR(255) NOT NULL,
                enabled BOOLEAN DEFAULT true,
                display_order INT
            )
        `);
        console.log('Extra tables created successfully');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
