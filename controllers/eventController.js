const Event = require('../models/Event');

/**
 * Obtiene TODOS los eventos.
 */
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find({}).populate('author', 'username');
        res.json(events);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene un evento por su id.
 */
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate('author', 'username');
        if (!event) {
            const err = new Error('Event not found');
            err.status = 404;
            return next(err);
        }
        res.json(event);
    } catch (error) {
        next(error);
    }
};

/**
 * Crea un nuevo evento.
 */
const createEvent = async (req, res, next) => {
    try {
        const event = new Event({
            title: req.body.title,
            text: req.body.text,
            image: req.body.image, // se espera base64
            link: req.body.link,
            author: req.user.id
        });

        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        next(error);
    }
};

/**
 * Actualiza un evento existente.
 */
const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            const err = new Error('Event not found');
            err.status = 404;
            return next(err);
        }
        // Solo autor o admin puede editar
        if (req.user.role !== 'admin' && event.author.toString() !== req.user.id) {
            const err = new Error('You are not authorized to edit this event');
            err.status = 403;
            return next(err);
        }
        // Actualiza los campos permitidos
        event.title = req.body.title || event.title;
        event.text = req.body.text || event.text;
        event.image = req.body.image || event.image;
        event.link = req.body.link || event.link;
        event.updatedAt = new Date();

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        next(error);
    }
};

/**
 * Elimina un evento.
 */
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            const err = new Error('Event not found');
            err.status = 404;
            return next(err);
        }
        // Solo autor o admin puede eliminar
        if (req.user.role !== 'admin' && event.author.toString() !== req.user.id) {
            const err = new Error('You are not authorized to delete this event');
            err.status = 403;
            return next(err);
        }
        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
