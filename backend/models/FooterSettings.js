const db = require('../config/db');

class FooterSettings {
    static async get() {
        const [rows] = await db.query('SELECT * FROM footer_settings WHERE id = 1');
        if (rows.length === 0) {
            return {
                description: '',
                address: '',
                mon_timing: '5:00 am–10:00 pm',
                tue_sat_timing: '5:00 am–10:00 pm',
                sun_timing: '5:00 am–10:00 pm',
                copyright: '©2026 SK Sports. All Rights Reserved.'
            };
        }
        return rows[0];
    }

    static async update(data) {
        const { description, address, mon_timing, tue_sat_timing, sun_timing, copyright } = data;
        await db.query(`
            INSERT INTO footer_settings (id, description, address, mon_timing, tue_sat_timing, sun_timing, copyright)
            VALUES (1, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE description=?, address=?, mon_timing=?, tue_sat_timing=?, sun_timing=?, copyright=?
        `, [description, address, mon_timing, tue_sat_timing, sun_timing, copyright,
            description, address, mon_timing, tue_sat_timing, sun_timing, copyright]);
        return this.get();
    }
}

module.exports = FooterSettings;
