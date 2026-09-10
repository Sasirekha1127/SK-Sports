const db = require('./config/db');

async function run() {
    const cols = [
        "ALTER TABLE about ADD COLUMN mission_title VARCHAR(255) DEFAULT 'Our Mission' AFTER body",
        "ALTER TABLE about ADD COLUMN mission_body TEXT NULL AFTER mission_title",
        "ALTER TABLE about ADD COLUMN mission_points TEXT NULL AFTER mission_body",
        "ALTER TABLE about ADD COLUMN vision_title VARCHAR(255) DEFAULT 'Our Vision' AFTER mission_points",
        "ALTER TABLE about ADD COLUMN vision_body TEXT NULL AFTER vision_title",
        "ALTER TABLE about ADD COLUMN vision_points TEXT NULL AFTER vision_body",
    ];

    for (const sql of cols) {
        try {
            await db.query(sql);
            console.log('OK:', sql.substring(20, 55));
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('SKIP (already exists):', sql.substring(36, 60));
            } else {
                console.error('ERR:', e.message);
            }
        }
    }
    console.log('Done!');
    process.exit(0);
}

run();
