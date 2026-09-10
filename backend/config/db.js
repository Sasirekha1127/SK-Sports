const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection and ensure max_allowed_packet is 64MB
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database does not exist. Please create the database in phpMyAdmin.');
        } else {
            console.error('Error connecting to MySQL:', err);
        }
    } else {
        console.log('Successfully connected to MySQL database.');
        connection.query('SET GLOBAL max_allowed_packet = 67108864', (qErr) => {
            if (qErr) console.warn('Could not set global max_allowed_packet:', qErr.message);
        });
        connection.release();
    }
});

module.exports = pool.promise();
