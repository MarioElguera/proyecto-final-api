const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
            minlength: [5, 'El título debe tener al menos 5 caracteres'],
            maxlength: [100, 'El título no puede superar los 100 caracteres']
        },
        content: {
            type: String,
            required: [true, 'El contenido es obligatorio'],
            minlength: [20, 'El contenido debe tener al menos 20 caracteres'],
            maxlength: [3000, 'El contenido no puede superar los 3000 caracteres']
        },
        category: {
            type: String,
            enum: ['futbol', 'viajes', 'musica', 'peliculas'],
            required: [true, 'La categoría es obligatoria']
        },
        image: {
            type: String,
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
    },
    {
        timestamps: true,
        collection: 'article'
    }
);

module.exports = mongoose.model('Article', articleSchema);
