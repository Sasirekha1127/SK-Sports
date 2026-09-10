const db = require('../config/db');

class Banner {
    static async getAll() {
        const [rows] = await db.query(`
            SELECT b.*, e.title as e_title, e.event_date as e_date, e.event_time as e_time, e.location as e_location, e.price as e_price, e.image as e_image 
            FROM banner b 
            LEFT JOIN events e ON b.event_id = e.id 
            ORDER BY b.display_order ASC
        `);
        return rows.map(r => ({
            ...r,
            enabled: r.enabled === 1,
            eventTag: r.event_id ? r.e_title : r.eventTag,
            eventDate: r.event_id ? r.e_date : r.eventDate,
            eventTime: r.event_id ? r.e_time : r.eventTime,
            eventLocation: r.event_id ? r.e_location : r.eventLocation,
            eventImage: (r.event_id && r.e_image) ? r.e_image : r.eventImage,
            eventPrice: r.event_id ? r.e_price : null,
            eventId: r.event_id // Map specifically for admin edit view
        }));
    }

    static async sync(slides) {
        // Simple sync: wipe and replace
        await db.query('DELETE FROM banner');
        if (!slides || slides.length === 0) return true;

        for (let i = 0; i < slides.length; i++) {
            const s = slides[i];
            await db.query(
                `INSERT INTO banner (
                    subtitle, title, description, ctaLabel, ctaLink, image, eventImage, 
                    eventTag, eventDate, eventTime, eventLocation, display_order, enabled, event_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    s.subtitle || '', s.title || '', s.description || '',
                    s.ctaLabel || '', s.ctaLink || '', s.image || '',
                    s.eventImage || '', s.eventTag || '', s.eventDate || '',
                    s.eventTime || '', s.eventLocation || '',
                    i, s.enabled === false ? 0 : 1, s.eventId || null
                ]
            );
        }
        return true;
    }
}
module.exports = Banner;
