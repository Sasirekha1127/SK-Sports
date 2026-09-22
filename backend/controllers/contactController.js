const Contact = require('../models/Contact');
const emailService = require('../services/emailService');

exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, age, message } = req.body;

        const trimmedName = typeof name === 'string' ? name.trim() : '';
        const trimmedEmail = typeof email === 'string' ? email.trim() : '';
        const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
        const trimmedMessage = typeof message === 'string' ? message.trim() : '';

        // Validation
        if (!trimmedName || trimmedName.length < 2) {
            return res.status(400).json({ success: false, message: 'Please provide a valid name (at least 2 characters).' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
        }

        const cleanPhone = trimmedPhone.replace(/[\s\-+()]/g, '');
        if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid phone number (at least 10 digits).' });
        }

        if (age !== undefined && age !== null && String(age).trim() !== '') {
            const ageNum = Number(age);
            if (isNaN(ageNum) || ageNum < 3 || ageNum > 120) {
                return res.status(400).json({ success: false, message: 'Please enter a valid age between 3 and 120.' });
            }
        }

        if (trimmedMessage && trimmedMessage.length < 3) {
            return res.status(400).json({ success: false, message: 'Message must be at least 3 characters long.' });
        }

        const payload = {
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            age: age ? String(age).trim() : null,
            message: trimmedMessage || ''
        };

        await Contact.create(payload);

        // Trigger email notification to Admin and confirmation auto-reply to visitor asynchronously
        emailService.sendContactNotification(payload).catch(e => {
            console.error('Async mail notification error:', e.message);
        });
        emailService.sendContactAutoReply(payload).catch(e => {
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
