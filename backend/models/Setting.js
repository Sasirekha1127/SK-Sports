const db = require('../config/db');

class Setting {
    static async getAll() {
        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS app_settings (
                    setting_key VARCHAR(255) PRIMARY KEY,
                    setting_value LONGTEXT
                )
            `);
            const [rows] = await db.query('SELECT * FROM app_settings');
            const settingsObj = {};
            for (let row of rows) {
                settingsObj[row.setting_key] = row.setting_value;
            }

            try {
                await db.query(`CREATE TABLE IF NOT EXISTS benefits (id INT PRIMARY KEY, subtitle VARCHAR(255), title VARCHAR(255), media LONGTEXT, items LONGTEXT)`);
                const [bRows] = await db.query('SELECT * FROM benefits WHERE id = 1');
                if (bRows.length > 0) {
                    let hp = settingsObj.homepage_data ? JSON.parse(settingsObj.homepage_data) : {};
                    hp.benefitsMeta = { subtitle: bRows[0].subtitle, title: bRows[0].title, media: bRows[0].media };
                    hp.benefits = bRows[0].items ? JSON.parse(bRows[0].items) : [];
                    settingsObj.homepage_data = JSON.stringify(hp);
                }
            } catch (e) {
                console.error('Error loading benefits into settings:', e);
            }

            return settingsObj;
        } catch (error) {
            console.error('Setting.getAll error:', error);
            return {};
        }
    }

    static async update(data) {
        try {
            // Ensure table exists
            await db.query(`
                CREATE TABLE IF NOT EXISTS app_settings (
                    setting_key VARCHAR(255) PRIMARY KEY,
                    setting_value LONGTEXT
                )
            `).catch((e) => { console.error('CREATE TABLE app_settings error:', e.message); });

            // Ensure column is LONGTEXT (safe alter)
            try {
                await db.query(`ALTER TABLE app_settings MODIFY COLUMN setting_value LONGTEXT`);
            } catch(e) { /* column already correct, ignore */ }

            // Handle benefits sync if homepage_data contains benefitsMeta/benefits
            if (data.homepage_data) {
                let hp;
                try {
                    hp = typeof data.homepage_data === 'string' ? JSON.parse(data.homepage_data) : data.homepage_data;
                } catch (e) {
                    console.error('homepage_data JSON parse error:', e.message);
                    hp = null;
                }

                if (hp && typeof hp === 'object' && (hp.benefitsMeta || hp.benefits)) {
                    try {
                        const meta = hp.benefitsMeta || {};
                        const items = JSON.stringify(hp.benefits || []);
                        await db.query(`CREATE TABLE IF NOT EXISTS benefits (id INT PRIMARY KEY, subtitle VARCHAR(255), title VARCHAR(255), media LONGTEXT, items LONGTEXT)`).catch(() => {});
                        await db.query(`ALTER TABLE benefits ADD COLUMN media LONGTEXT`).catch(() => {});
                        await db.query(`ALTER TABLE benefits ADD COLUMN items LONGTEXT`).catch(() => {});

                        await db.query(`
                            INSERT INTO benefits (id, subtitle, title, media, items) VALUES (1, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE subtitle=?, title=?, media=?, items=?
                        `, [
                            meta.subtitle || '', meta.title || '', meta.media || '', items,
                            meta.subtitle || '', meta.title || '', meta.media || '', items
                        ]);
                        delete hp.benefitsMeta;
                        delete hp.benefits;
                        data = { ...data, homepage_data: JSON.stringify(hp) };
                    } catch (bErr) {
                        console.error('Benefits sync skipped/error:', bErr?.message);
                    }
                }
            }

            // Save each key-value pair
            for (let key in data) {
                let val = data[key];
                if (val === null || val === undefined) {
                    val = '';
                } else if (typeof val === 'object') {
                    val = JSON.stringify(val);
                } else {
                    val = String(val);
                }

                try {
                    await db.query(`
                        INSERT INTO app_settings (setting_key, setting_value) 
                        VALUES (?, ?) 
                        ON DUPLICATE KEY UPDATE setting_value = ?
                    `, [key, val, val]);
                } catch (insertErr) {
                    console.error(`Setting.update INSERT error for key "${key}":`, insertErr.message);
                    throw insertErr;
                }
            }
            return true;
        } catch (error) {
            console.error("Setting.update error:", error);
            throw error;
        }
    }
}

module.exports = Setting;
