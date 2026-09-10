const db = require('../config/db');

class About {
    static async ensureColumns() {
        // Ensure table exists with all columns
        await db.query(`
            CREATE TABLE IF NOT EXISTS about (
                id INT PRIMARY KEY DEFAULT 1,
                subtitle VARCHAR(255),
                title VARCHAR(255),
                body TEXT,
                image LONGTEXT,
                buttonLabel VARCHAR(255),
                buttonLink VARCHAR(255),
                mission_title VARCHAR(255) DEFAULT 'Our Mission',
                mission_body TEXT,
                mission_points TEXT,
                vision_title VARCHAR(255) DEFAULT 'Our Vision',
                vision_body TEXT,
                vision_points TEXT,
                mission_image1 LONGTEXT,
                mission_image2 LONGTEXT
            )
        `).catch(() => {});
        // Add columns if missing (for older DB installs)
        const cols = [
            'mission_title', 'mission_body', 'mission_points',
            'vision_title', 'vision_body', 'vision_points',
            'mission_image1', 'mission_image2'
        ];
        for (const col of cols) {
            await db.query(`ALTER TABLE about ADD COLUMN ${col} LONGTEXT`).catch(() => {});
        }
    }

    static async get() {
        await About.ensureColumns();
        const [rows] = await db.query('SELECT * FROM about WHERE id = 1');
        return rows[0] || {
            subtitle: '', title: '', body: '', image: '', buttonLabel: '', buttonLink: '',
            mission_title: 'Our Mission', mission_body: '', mission_points: '',
            vision_title: 'Our Vision', vision_body: '', vision_points: '',
            mission_image1: '', mission_image2: ''
        };
    }

    static async update(data) {
        await About.ensureColumns();
        const {
            subtitle, title, body, image, buttonLabel, buttonLink,
            mission_title, mission_body, mission_points,
            vision_title, vision_body, vision_points,
            mission_image1, mission_image2
        } = data;

        const [rows] = await db.query('SELECT id FROM about WHERE id = 1');

        if (rows.length > 0) {
            await db.query(
                `UPDATE about SET 
                    subtitle=?, title=?, body=?, image=?, buttonLabel=?, buttonLink=?,
                    mission_title=?, mission_body=?, mission_points=?,
                    vision_title=?, vision_body=?, vision_points=?,
                    mission_image1=?, mission_image2=?
                WHERE id=1`,
                [
                    subtitle || '', title || '', body || '', image || '', buttonLabel || '', buttonLink || '',
                    mission_title || 'Our Mission', mission_body || '', mission_points || '',
                    vision_title || 'Our Vision', vision_body || '', vision_points || '',
                    mission_image1 || '', mission_image2 || ''
                ]
            );
        } else {
            await db.query(
                `INSERT INTO about 
                    (id, subtitle, title, body, image, buttonLabel, buttonLink, mission_title, mission_body, mission_points, vision_title, vision_body, vision_points, mission_image1, mission_image2) 
                VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    subtitle || '', title || '', body || '', image || '', buttonLabel || '', buttonLink || '',
                    mission_title || 'Our Mission', mission_body || '', mission_points || '',
                    vision_title || 'Our Vision', vision_body || '', vision_points || '',
                    mission_image1 || '', mission_image2 || ''
                ]
            );
        }
        return true;
    }
}

module.exports = About;

