const Banner = require('../models/Banner');

exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.getAll();
        res.status(200).json(banners);
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch banners' });
    }
};

exports.syncBanners = async (req, res) => {
    try {
        const slides = req.body;
        await Banner.sync(slides);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error syncing banners:', error);
        res.status(500).json({ success: false, message: 'Failed to sync banners' });
    }
};
