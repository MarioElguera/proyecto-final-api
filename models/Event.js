const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'El título del evento es obligatorio'],
            trim: true,
            minlength: [5, 'El título debe tener al menos 5 caracteres'],
            maxlength: [100, 'El título no puede superar los 100 caracteres']
        },
        text: {
            type: String,
            required: [true, 'La descripción del evento es obligatoria'],
            minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
            maxlength: [1000, 'La descripción no puede superar los 1000 caracteres']
        },
        image: {
            type: String,
            default: ''
        },
        link: {
            type: String,
            required: [true, 'El enlace del evento es obligatorio'],
            trim: true
        },
        eventDate: {
            type: Date,
            required: [true, 'La fecha del evento es obligatoria']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        collection: 'event'
    }
);

module.exports = mongoose.model('Event', eventSchema);
