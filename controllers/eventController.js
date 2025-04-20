const mongoose = require('mongoose');
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
            const err = new Error('Evento no encontrado');
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
            image: req.body.image,
            link: req.body.link,
            eventDate: req.body.eventDate,
            author: req.user.id,
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
            const err = new Error('Evento no encontrado');
            err.status = 404;
            return next(err);
        }

        if (req.user.role !== 'admin' && event.author.toString() !== req.user.id) {
            const err = new Error('No estás autorizado para editar este evento');
            err.status = 403;
            return next(err);
        }

        event.title = req.body.title || event.title;
        event.text = req.body.text || event.text;
        event.image = req.body.image || event.image;
        event.link = req.body.link || event.link;
        event.eventDate = req.body.eventDate || event.eventDate;
        event.updatedAt = new Date();

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        next(error);
    }
};

/**
 * Elimina un evento (con transacción aunque no haya referencias).
 */
const deleteEvent = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const event = await Event.findById(req.params.id).session(session);
        if (!event) {
            const err = new Error('Evento no encontrado');
            err.status = 404;
            await session.abortTransaction();
            session.endSession();
            return next(err);
        }

        if (req.user.role !== 'admin' && event.author.toString() !== req.user.id) {
            const err = new Error('No estás autorizado para eliminar este evento');
            err.status = 403;
            await session.abortTransaction();
            session.endSession();
            return next(err);
        }

        await event.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Evento eliminado correctamente.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};
