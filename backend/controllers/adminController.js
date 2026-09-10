const Product = require('../models/Product');
const Partner = require('../models/Partner');
const Navigation = require('../models/Navigation');

exports.getProducts = async (req, res) => res.json(await Product.getAll());
exports.createProduct = async (req, res) => res.json(await Product.create(req.body));
exports.updateProduct = async (req, res) => res.json({ success: await Product.update(req.params.id, req.body) });
exports.deleteProduct = async (req, res) => res.json({ success: await Product.remove(req.params.id) });

exports.getPartners = async (req, res) => res.json(await Partner.getAll());
exports.createPartner = async (req, res) => res.json(await Partner.create(req.body));
exports.updatePartner = async (req, res) => res.json({ success: await Partner.update(req.params.id, req.body) });
exports.deletePartner = async (req, res) => res.json({ success: await Partner.remove(req.params.id) });

exports.getNavigation = async (req, res) => res.json(await Navigation.getAll());
exports.createNavigation = async (req, res) => res.json(await Navigation.create(req.body));
exports.updateNavigation = async (req, res) => res.json({ success: await Navigation.update(req.params.id, req.body) });
exports.deleteNavigation = async (req, res) => res.json({ success: await Navigation.remove(req.params.id) });
const AdminUser = require('../models/AdminUser');
exports.getAdminUsers = async (req, res) => res.json(await AdminUser.getAll());
exports.createAdminUser = async (req, res) => res.json(await AdminUser.create(req.body));
exports.updateAdminUser = async (req, res) => res.json({ success: await AdminUser.update(req.params.id, req.body) });
exports.deleteAdminUser = async (req, res) => res.json({ success: await AdminUser.remove(req.params.id) });

exports.changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.admin?.id;
        if (!adminId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
        }
        await AdminUser.changePassword(adminId, currentPassword, newPassword);
        res.json({ success: true, message: 'Password updated successfully.' });
    } catch (e) {
        console.error('changeAdminPassword error:', e);
        res.status(400).json({ success: false, message: e.message || 'Failed to update password' });
    }
};

exports.resetAdminPassword = async (req, res) => {
    try {
        const { id, newPassword } = req.body;
        if (!id || !newPassword) {
            return res.status(400).json({ success: false, message: 'Target user ID and new password are required.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
        }
        await AdminUser.resetPassword(id, newPassword);
        res.json({ success: true, message: 'User password reset successfully.' });
    } catch (e) {
        console.error('resetAdminPassword error:', e);
        res.status(400).json({ success: false, message: e.message || 'Failed to reset password' });
    }
};
const Team = require('../models/Team');
const Testimonial = require('../models/Testimonial');
const Media = require('../models/Media');
const Setting = require('../models/Setting');

exports.getTeam = async (req, res) => res.json(await Team.getAll());
exports.createTeam = async (req, res) => res.json(await Team.create(req.body));
exports.updateTeam = async (req, res) => res.json({ success: await Team.update(req.params.id, req.body) });
exports.deleteTeam = async (req, res) => res.json({ success: await Team.remove(req.params.id) });

exports.getTestimonials = async (req, res) => res.json(await Testimonial.getAll());
exports.createTestimonial = async (req, res) => res.json(await Testimonial.create(req.body));
exports.updateTestimonial = async (req, res) => res.json({ success: await Testimonial.update(req.params.id, req.body) });
exports.deleteTestimonial = async (req, res) => res.json({ success: await Testimonial.remove(req.params.id) });

exports.getMedia = async (req, res) => res.json(await Media.getAll());
exports.createMedia = async (req, res) => res.json(await Media.create(req.body));
exports.updateMedia = async (req, res) => res.json({ success: await Media.update(req.params.id, req.body) });
exports.deleteMedia = async (req, res) => res.json({ success: await Media.remove(req.params.id) });

exports.getSettings = async (req, res) => {
    try {
        const settings = await Setting.getAll();
        res.json(settings);
    } catch (e) {
        console.error('getSettings error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const success = await Setting.update(req.body);
        res.json({ success });
    } catch (e) {
        console.error('updateSettings error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
};

// Dashboard stats:
const Contact = require('../models/Contact');
const Registration = require('../models/Registration');
const Blog = require('../models/Blog');
const Event = require('../models/Event');

exports.getStats = async (req, res) => {
    const contacts = await Contact.getAll();
    const registrations = await Registration.getAll();
    const blogs = await Blog.getAll();
    const events = await Event.getAll();

    res.json({
        messagesCount: contacts.length,
        unreadMessagesCount: contacts.filter(c => !c.read).length,
        registrationsCount: registrations.length,
        blogsCount: blogs.length,
        eventsCount: events.length
    });
};


