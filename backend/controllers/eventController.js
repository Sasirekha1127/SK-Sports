const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.getAll();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch events.' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.getById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }

        res.status(200).json({ success: true, data: event });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch event details.' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const result = await Event.create(req.body);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, message: 'Failed to create event.' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        await Event.update(req.params.id, req.body);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, message: 'Failed to update event.' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.remove(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, message: 'Failed to delete event.' });
    }
};
