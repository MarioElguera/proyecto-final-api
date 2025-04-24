const Event = require('../models/Event');

/**
 * Manejador de errores personalizados
 */
const createError = (message, status = 500) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

/**
 * GET /events
 * Obtiene todos los eventos disponibles
 */
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({ eventDate: 1 }).populate('author', 'username');
        res.json(events);
    } catch (error) {
        next(createError('Error al obtener los eventos', 500));
    }
};

/**
 * GET /events/:id
 * Obtiene un evento por su ID
 */
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return next(createError('Evento no encontrado', 404));
        res.json(event);
    } catch (error) {
        next(createError('Error al obtener el evento', 500));
    }
};

/**
 * POST /events
 * Crea un nuevo evento
 */
const createEvent = async (req, res, next) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            text: req.body.text,
            eventDate: req.body.eventDate,
            image: req.body.image || '',
            link: req.body.link || '',
            author: req.user.id
        });

        const saved = await newEvent.save();
        res.status(201).json(saved);
    } catch (error) {
        next(createError('Error al crear el evento. Revisa los campos ingresados.', 400));
    }
};

/**
 * PUT /events/:id
 * Actualiza un evento existente
 */
const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return next(createError('Evento no encontrado', 404));

        const notAuthorized = req.user.role !== 'admin' && event.author.toString() !== req.user.id;
        if (notAuthorized) return next(createError('No estás autorizado para editar este evento', 403));

        event.title = req.body.title || event.title;
        event.text = req.body.text || event.text;
        event.eventDate = req.body.eventDate || event.eventDate;
        event.image = req.body.image || event.image;
        event.link = req.body.link || event.link;

        const updated = await event.save();
        res.json(updated);

    } catch (error) {
        next(createError('Error al actualizar el evento.', 400));
    }
};

/**
 * DELETE /events/:id
 * Elimina un evento
 */
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return next(createError('Evento no encontrado', 404));

        const notAuthorized = req.user.role !== 'admin' && event.author.toString() !== req.user.id;
        if (notAuthorized) return next(createError('No estás autorizado para eliminar este evento', 403));

        await event.deleteOne();
        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        next(createError('Error al eliminar el evento', 500));
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
