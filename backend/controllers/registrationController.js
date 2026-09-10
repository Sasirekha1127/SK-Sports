const Registration = require('../models/Registration');

exports.submitRegistration = async (req, res) => {
    try {
        const { author, email, telephone, sex } = req.body;
        // In frontend form it passes author as name and telephone as phone

        // Basic validation
        if (!author || !email || !telephone) {
            return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
        }

        await Registration.create({
            name: author,
            email,
            phone: telephone,
            gender: sex
        });

        res.status(201).json({ success: true, message: 'Registration submit successfully.' });
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
