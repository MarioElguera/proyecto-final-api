const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String, // Se guardará en formato base64
        default: ''
    },
    link: {
        type: String, // URL a la página oficial del evento
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    collection: 'event'
});

module.exports = mongoose.model('Event', eventSchema);
