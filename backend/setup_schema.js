const db = require('./config/db');

async function createTables() {
    try {
        console.log("Creating tables...");

        // 1. contact_messages
        await db.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                age INT,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. academy_registrations
        await db.query(`
            CREATE TABLE IF NOT EXISTS academy_registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                gender VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. blogs
        await db.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                tag VARCHAR(100),
                author VARCHAR(150),
                publish_date DATE,
                content TEXT,
                image_url VARCHAR(255),
                comments_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. events
        await db.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                event_date DATE NOT NULL,
                event_time VARCHAR(100),
                location VARCHAR(255),
                price DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. about
        await db.query(`
            CREATE TABLE IF NOT EXISTS about (
                id INT PRIMARY KEY DEFAULT 1,
                subtitle VARCHAR(255),
                title VARCHAR(255),
                body TEXT,
                image TEXT,
                buttonLabel VARCHAR(255),
                buttonLink VARCHAR(255),
                mission_title VARCHAR(255) DEFAULT 'Our Mission',
                mission_body TEXT,
                mission_points TEXT,
                vision_title VARCHAR(255) DEFAULT 'Our Vision',
                vision_body TEXT,
                vision_points TEXT
            )
        `);

        console.log("All tables created successfully!");

        // Insert some Seed Data (only if table is empty)
        const [blogsCount] = await db.query('SELECT COUNT(*) AS count FROM blogs');
        if (blogsCount[0].count === 0) {
            await db.query(`
                INSERT INTO blogs (title, tag, author, publish_date, content, image_url, comments_count)
                VALUES 
                ('Mastering the Smash: Advanced Techniques', 'Training', 'Coach Ravi', '2024-10-12', 'Welcome to the latest guide by Coach Ravi...', 'images/blog/blog1.jpg', 4),
                ('Choosing the Right Racket: A Complete Guide', 'Gear', 'SK Sports Team', '2024-10-15', 'Understanding racket mechanics...', 'images/blog/blog2.png', 7),
                ('Nutrition Strategies for Peak Performance', 'Health & Fitness', 'Dr. Ananya', '2024-10-20', 'What to eat before the match...', 'images/blog/blog3.png', 2)
            `);
            console.log("Seeded blogs data.");
        }

        const [eventsCount] = await db.query('SELECT COUNT(*) AS count FROM events');
        if (eventsCount[0].count === 0) {
            await db.query(`
                INSERT INTO events (title, event_date, event_time, location, price)
                VALUES 
                ('State Level Men\\'s Doubles', '2024-10-20', '09:00 AM start', 'SK Sports Academy Main Court | Pondicherry', 500.00),
                ('State Level Women\\'s Singles', '2024-10-22', '09:00 AM start', 'SK Sports Academy Main Court | Pondicherry', 500.00),
                ('Junior Under-18 Championship', '2024-11-10', '08:00 AM start', 'SK Sports Academy Main Court | Pondicherry', 400.00),
                ('Mixed Doubles Open Tournament', '2024-12-15', '10:00 AM start', 'SK Sports Academy Main Court | Pondicherry', 600.00)
            `);
            console.log("Seeded events data.");
        }

    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        process.exit();
    }
}

createTables();
