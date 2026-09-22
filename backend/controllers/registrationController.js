const Registration = require('../models/Registration');
const emailService = require('../services/emailService');

exports.submitRegistration = async (req, res) => {
    try {
        const { 
            name, author, 
            phone, telephone, 
            email, 
            gender, sex, 
            dob, 
            sport, 
            skill_level, 
            training_time, 
            message 
        } = req.body;

        const rawName = name || author || '';
        const rawPhone = phone || telephone || '';
        const rawGender = gender || sex || '';

        const trimmedName = typeof rawName === 'string' ? rawName.trim() : '';
        const trimmedEmail = typeof email === 'string' ? email.trim() : '';
        const trimmedPhone = typeof rawPhone === 'string' ? rawPhone.trim() : '';
        const trimmedGender = typeof rawGender === 'string' ? rawGender.trim() : 'Male';
        const trimmedDob = typeof dob === 'string' ? dob.trim() : '';
        const trimmedSport = typeof sport === 'string' ? sport.trim() : 'Badminton';
        const trimmedSkill = typeof skill_level === 'string' ? skill_level.trim() : 'Beginner';
        const trimmedTime = typeof training_time === 'string' ? training_time.trim() : 'Flexible';
        const trimmedMsg = typeof message === 'string' ? message.trim() : '';

        // Validation
        if (!trimmedName || trimmedName.length < 2) {
            return res.status(400).json({ success: false, message: 'Please provide your full name (at least 2 characters).' });
        }

        const cleanPhone = trimmedPhone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
        }

        const payload = {
            name: trimmedName,
            email: trimmedEmail,
            phone: cleanPhone,
            gender: trimmedGender,
            dob: trimmedDob,
            sport: trimmedSport,
            skill_level: trimmedSkill,
            training_time: trimmedTime,
            message: trimmedMsg
        };

        await Registration.create(payload);

        // Send email notifications asynchronously
        emailService.sendRegistrationNotification(payload).catch(e => {
            console.error('Async mail registration notification error:', e.message);
        });
        if (trimmedEmail) {
            emailService.sendRegistrationAutoReply(payload).catch(e => {
                console.error('Async mail registration auto-reply error:', e.message);
            });
        }

        res.status(201).json({ success: true, message: 'Registration submitted successfully.' });
    } catch (error) {
        console.error('Registration submit error:', error);
        res.status(500).json({ success: false, message: 'Server error while registering.' });
    }
};


exports.getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.getAll();
        res.status(200).json(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch registrations.' });
    }
};

exports.updateRegistrationRead = async (req, res) => {
    try {
        await Registration.updateRead(req.params.id, req.body.read);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating registration:', error);
        res.status(500).json({ success: false, message: 'Failed to update registration.' });
    }
};

exports.deleteRegistration = async (req, res) => {
    try {
        await Registration.remove(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).json({ success: false, message: 'Failed to delete registration.' });
    }
};
