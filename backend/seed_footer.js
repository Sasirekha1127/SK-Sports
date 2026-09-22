const db = require('./config/db');

async function seed() {
    await db.query(`
        INSERT INTO footer_settings (id, description, address, mon_timing, tue_sat_timing, sun_timing, copyright)
        VALUES (1, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE description=VALUES(description), address=VALUES(address)
    `, [
        'Welcome to SK Sports Academy! Discover the joy of Badminton, connect with fellow enthusiasts, and unlock your full potential with our expert coaching and training programs.',
        '2/364, Kalivelampatti Pirivu, Coimbatore - Trichy Rd, opp. Kongu Kalyana Mandapam, Palladam, Tamil Nadu 641662',
        '5:00 am–10:00 pm',
        '5:00 am–10:00 pm',
        '5:00 am–10:00 pm',
        '©2026 SK Sports. All Rights Reserved.'
    ]);
    console.log('Footer seed OK');
    process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
