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
        type: String,
        default: ''
    },
    link: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
    collection: 'event'
});

module.exports = mongoose.model('Event', eventSchema);
