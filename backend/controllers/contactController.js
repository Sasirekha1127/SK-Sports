const Contact = require('../models/Contact');
const emailService = require('../services/emailService');

exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, age, message } = req.body;

        // Basic validation
        if (!name || !email || !phone) {
            return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
        }

        await Contact.create({ name, email, phone, age, message });

        // Trigger email notification to Admin and confirmation auto-reply to visitor asynchronously
        emailService.sendContactNotification({ name, email, phone, age, message }).catch(e => {
            console.error('Async mail notification error:', e.message);
        });
        emailService.sendContactAutoReply({ name, email, phone, age, message }).catch(e => {
            console.error('Async mail auto-reply error:', e.message);
        });

        res.status(201).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Contact submit error:', error);
        res.status(500).json({ success: false, message: 'Server error while submitting message.' });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.getAll();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
    }
};

exports.updateContactReadStatus = async (req, res) => {
    try {
        await Contact.updateRead(req.params.id, req.body.read);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ success: false, message: 'Failed to update contact.' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await Contact.remove(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ success: false, message: 'Failed to delete contact.' });
    }
};
