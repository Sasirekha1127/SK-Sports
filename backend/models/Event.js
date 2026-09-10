const db = require('../config/db');

class Event {
    static async migrate() {
        const migrations = [
            `ALTER TABLE events ADD COLUMN IF NOT EXISTS image LONGTEXT`,
            `ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'upcoming'`,
            `ALTER TABLE events ADD COLUMN IF NOT EXISTS featured TINYINT(1) DEFAULT 0`,
        ];
        for (const sql of migrations) {
            await db.query(sql).catch(() => { });
        }
    }

    static async getAll() {
        await Event.migrate();
        const [rows] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        await Event.migrate();
        const { title, event_date, event_time, location, price, image, status, featured } = data;
        const [result] = await db.query(
            'INSERT INTO events (title, event_date, event_time, location, price, image, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, event_date, event_time || '', location || '', price || 0, image || '', status || 'upcoming', featured ? 1 : 0]
        );
        return result;
    }

    static async update(id, data) {
        const existing = await Event.getById(id);
        const title = data.title !== undefined ? data.title : existing?.title;
        let event_date = data.event_date !== undefined && data.event_date !== '' ? data.event_date : existing?.event_date;
        if (event_date instanceof Date) {
            const y = event_date.getFullYear();
            const m = String(event_date.getMonth() + 1).padStart(2, '0');
            const d = String(event_date.getDate()).padStart(2, '0');
            event_date = `${y}-${m}-${d}`;
        } else if (typeof event_date === 'string' && event_date.includes('T')) {
            event_date = event_date.split('T')[0];
        }
        const event_time = data.event_time !== undefined ? data.event_time : (existing?.event_time || '');
        const location = data.location !== undefined ? data.location : (existing?.location || '');
        const price = data.price !== undefined ? data.price : (existing?.price || 0);
        const image = data.image !== undefined ? data.image : (existing?.image || '');
        const status = data.status !== undefined ? data.status : (existing?.status || 'upcoming');
        const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : (existing?.featured ? 1 : 0);

        await db.query(
            'UPDATE events SET title=?, event_date=?, event_time=?, location=?, price=?, image=?, status=?, featured=? WHERE id=?',
            [title, event_date, event_time, location, price, image, status, featured, id]
        );
        return true;
    }

    static async remove(id) {
        await db.query('DELETE FROM events WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Event;
