const mongoose = require('mongoose');
const Comment = require('../models/Comment');

// Obtener TODOS los comentarios
const getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({}).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

// Obtener comentarios de un artículo
const getCommentsByArticle = async (req, res, next) => {
    try {
        const comments = await Comment.find({ article: req.params.articleId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

// Crear un comentario
const createComment = async (req, res, next) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            article: req.params.articleId,
            author: req.user.id,
        });

        const saved = await comment.save();
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
};

// Actualizar un comentario
const updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            const err = new Error('Comentario no encontrado');
            err.status = 404;
            return next(err);
        }

        if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id) {
            const err = new Error('No estás autorizado para editar este comentario');
            err.status = 403;
            return next(err);
        }

        comment.content = req.body.content || comment.content;
        comment.updatedAt = new Date();

        const updated = await comment.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// Eliminar un comentario con Transacción
const deleteComment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const comment = await Comment.findById(req.params.id).session(session);
        if (!comment) {
            const err = new Error('Comentario no encontrado');
            err.status = 404;
            await session.abortTransaction();
            session.endSession();
            return next(err);
        }

        if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id) {
            const err = new Error('No estás autorizado para eliminar este comentario');
            err.status = 403;
            await session.abortTransaction();
            session.endSession();
            return next(err);
        }

        await comment.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Comentario eliminado correctamente.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

module.exports = {
    getAllComments,
    getCommentsByArticle,
    createComment,
    updateComment,
    deleteComment
};
