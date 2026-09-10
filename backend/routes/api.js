const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');
const blogController = require('../controllers/blogController');
const eventController = require('../controllers/eventController');
const bannerController = require('../controllers/bannerController');
const aboutController = require('../controllers/aboutController');
const FooterSettings = require('../models/FooterSettings');

// Public form routes
router.post('/contact', contactController.submitContact);
router.post('/register', registrationController.submitRegistration);

// Public data routes
router.get('/settings', adminController.getSettings);
router.get('/banner', bannerController.getBanners);
router.get('/about', aboutController.getAbout);
router.get('/team', adminController.getTeam);
router.get('/testimonials', adminController.getTestimonials);
router.get('/footer-settings', async (req, res) => { try { res.json(await FooterSettings.get()); } catch (e) { res.status(500).json({ error: e.message }); } });
// Public Data APIs
router.get('/products', adminController.getProducts);
router.get('/partners', adminController.getPartners);
router.get('/navigation', adminController.getNavigation);
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:id', blogController.getBlogById);

router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);

// =====================================
// Admin Authentication
// =====================================
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');

const JWT_SECRET = process.env.JWT_SECRET || 'sk_admin_secret_key_123!';

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AdminUser.getByEmail(email);
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: user.name, email, role: user.role } });
    } catch (e) {
        console.error("Login error:", e);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Middleware for protected routes
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

// =====================================
// PROTECTED ADMIN CRUD ROUTES
// =====================================
router.use('/admin', adminAuth);

// Messages (Contacts)
router.get('/admin/messages', contactController.getContacts);
router.patch('/admin/messages/:id', contactController.updateContactReadStatus);
router.delete('/admin/messages/:id', contactController.deleteContact);

// Registrations
router.get('/admin/registrations', registrationController.getRegistrations);
router.patch('/admin/registrations/:id', registrationController.updateRegistrationRead);
router.delete('/admin/registrations/:id', registrationController.deleteRegistration);

// Blogs 
router.post('/admin/blogs', blogController.createBlog);
router.patch('/admin/blogs/:id', blogController.updateBlog);
router.delete('/admin/blogs/:id', blogController.deleteBlog);

// Events
router.post('/admin/events', eventController.createEvent);
router.patch('/admin/events/:id', eventController.updateEvent);
router.delete('/admin/events/:id', eventController.deleteEvent);

// Admin Extra routes
router.get('/admin/team', adminController.getTeam);
router.post('/admin/team', adminController.createTeam);
router.patch('/admin/team/:id', adminController.updateTeam);
router.delete('/admin/team/:id', adminController.deleteTeam);

router.get('/admin/testimonials', adminController.getTestimonials);
router.post('/admin/testimonials', adminController.createTestimonial);
router.patch('/admin/testimonials/:id', adminController.updateTestimonial);
router.delete('/admin/testimonials/:id', adminController.deleteTestimonial);

router.get('/admin/media', adminController.getMedia);
router.post('/admin/media', adminController.createMedia);
router.patch('/admin/media/:id', adminController.updateMedia);
router.delete('/admin/media/:id', adminController.deleteMedia);

router.get('/admin/settings', adminController.getSettings);
router.put('/admin/settings', adminController.updateSettings);

router.put('/admin/banner', bannerController.syncBanners);
router.put('/admin/about', aboutController.updateAbout);
router.get('/admin/footer-settings', async (req, res) => { try { res.json(await FooterSettings.get()); } catch (e) { res.status(500).json({ error: e.message }); } });
router.put('/admin/footer-settings', async (req, res) => { try { res.json(await FooterSettings.update(req.body)); } catch (e) { res.status(500).json({ error: e.message }); } });

router.get('/admin/stats', adminController.getStats);

const emailService = require('../services/emailService');

router.get('/admin/users', adminController.getAdminUsers);
router.post('/admin/users', adminController.createAdminUser);
router.patch('/admin/users/:id', adminController.updateAdminUser);
router.delete('/admin/users/:id', adminController.deleteAdminUser);
router.post('/admin/change-password', adminController.changeAdminPassword);
router.post('/admin/reset-password', adminController.resetAdminPassword);
router.get('/admin/products', adminController.getProducts);
router.post('/admin/products', adminController.createProduct);
router.patch('/admin/products/:id', adminController.updateProduct);
router.delete('/admin/products/:id', adminController.deleteProduct);

router.get('/admin/partners', adminController.getPartners);
router.post('/admin/partners', adminController.createPartner);
router.patch('/admin/partners/:id', adminController.updatePartner);
router.delete('/admin/partners/:id', adminController.deletePartner);

router.get('/admin/navigation', adminController.getNavigation);
router.post('/admin/navigation', adminController.createNavigation);
router.patch('/admin/navigation/:id', adminController.updateNavigation);
router.delete('/admin/navigation/:id', adminController.deleteNavigation);
module.exports = router;




