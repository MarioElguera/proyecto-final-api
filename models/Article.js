const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['futbol', 'viajes', 'musica', 'peliculas'],
        required: true
    },
    image: {
        type: String, // URL de una imagen, si quieres permitir eso
        default: ''
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
    updatedAt: Date
}, {
    timestamps: true,
    collection: 'article'
});

module.exports = mongoose.model('Article', articleSchema);
