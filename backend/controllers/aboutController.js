const About = require('../models/About');

exports.getAbout = async (req, res) => {
    try {
        const aboutData = await About.get();
        res.status(200).json(aboutData);
    } catch (error) {
        console.error('Error fetching about section:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch about data' });
    }
};

exports.updateAbout = async (req, res) => {
    try {
        await About.update(req.body);
        res.status(200).json({ success: true, message: 'About updated successfully' });
    } catch (error) {
        console.error('Error updating about section:', error);
        res.status(500).json({ success: false, message: 'Failed to update about data' });
    }
};
