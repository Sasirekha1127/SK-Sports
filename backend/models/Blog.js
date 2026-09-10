const db = require('../config/db');

class Blog {
    static async migrate() {
        const migrations = [
            `ALTER TABLE blogs MODIFY COLUMN image_url LONGTEXT`,
            `ALTER TABLE blogs ADD COLUMN status VARCHAR(50) DEFAULT 'published'`,
            `ALTER TABLE blogs ADD COLUMN featured BOOLEAN DEFAULT FALSE`
        ];
        for (const sql of migrations) {
            await db.query(sql).catch(() => { });
        }
    }

    static async getAll() {
        await Blog.migrate();
        const [rows] = await db.query('SELECT * FROM blogs ORDER BY publish_date DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        await Blog.migrate();
        const { title, tag, author, publish_date, content, image_url, status, featured } = data;
        const _featured = featured ? 1 : 0;
        const _status = status || 'published';
        const [result] = await db.query(
            'INSERT INTO blogs (title, tag, author, publish_date, content, image_url, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, tag, author, publish_date || new Date(), content, image_url || null, _status, _featured]
        );
        return result;
    }

    static async update(id, data) {
        await Blog.migrate();
        const existing = await Blog.getById(id);
        const title = data.title !== undefined ? data.title : existing?.title;
        const tag = data.tag !== undefined ? data.tag : existing?.tag;
        const author = data.author !== undefined ? data.author : existing?.author;
        let publish_date = data.publish_date !== undefined && data.publish_date !== '' ? data.publish_date : existing?.publish_date;
        if (publish_date instanceof Date) {
            const y = publish_date.getFullYear();
            const m = String(publish_date.getMonth() + 1).padStart(2, '0');
            const d = String(publish_date.getDate()).padStart(2, '0');
            publish_date = `${y}-${m}-${d}`;
        } else if (typeof publish_date === 'string' && publish_date.includes('T')) {
            publish_date = publish_date.split('T')[0];
        }
        const content = data.content !== undefined ? data.content : existing?.content;
        const image_url = data.image_url !== undefined ? data.image_url : existing?.image_url;
        const _status = data.status !== undefined ? data.status : (existing?.status || 'published');
        const _featured = data.featured !== undefined ? (data.featured ? 1 : 0) : (existing?.featured ? 1 : 0);

        await db.query(
            'UPDATE blogs SET title = ?, tag = ?, author = ?, publish_date = ?, content = ?, image_url = ?, status = ?, featured = ? WHERE id = ?',
            [title, tag, author, publish_date, content, image_url, _status, _featured, id]
        );
        return true;
    }

    static async remove(id) {
        await db.query('DELETE FROM blogs WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Blog;
    