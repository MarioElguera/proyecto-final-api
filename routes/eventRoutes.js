const express = require('express');
const router = express.Router();

// Controladores de 'events'
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');
const auth = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Rutas privadas (requieren login)
router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
