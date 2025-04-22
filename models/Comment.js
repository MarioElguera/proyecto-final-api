const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'El contenido del comentario es obligatorio'],
            trim: true,
            minlength: [5, 'El comentario debe tener al menos 5 caracteres'],
            maxlength: [500, 'El comentario no puede superar los 500 caracteres']
        },
        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
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
        updatedAt: Date
    },
    {
        timestamps: true,
        collection: 'comment'
    }
);

module.exports = mongoose.model('Comment', commentSchema);
