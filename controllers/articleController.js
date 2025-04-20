const mongoose = require('mongoose');
const Article = require('../models/Article');
const Comment = require('../models/Comment');

// Trae un artículo con todos los comentarios relacionados
const getFullArticleById = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) {
            const err = new Error('Artículo no encontrado');
            err.status = 404;
            return next(err);
        }

        const comments = await Comment.find({ article: req.params.id }).populate('author', 'username');

        res.json({ article, comments });
    } catch (error) {
        next(error);
    }
};

// Trae todos los artículos, con filtro opcional por categoría
const getAllArticles = async (req, res, next) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const articles = await Article.find(filter).populate('author', 'username');
        res.json(articles);
    } catch (error) {
        next(error);
    }
};

// Trae el detalle de un artículo por ID
const getArticleById = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) {
            const err = new Error('Artículo no encontrado');
            err.status = 404;
            return next(err);
        }
        res.json(article);
    } catch (error) {
        next(error);
    }
};

// Crea un nuevo artículo
const createArticle = async (req, res, next) => {
    try {
        const article = new Article({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image || '',
            author: req.user.id,
        });

        const saved = await article.save();
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
};

// Actualiza un artículo existente
const updateArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            const err = new Error('Artículo no encontrado');
            err.status = 404;
            return next(err);
        }

        if (req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
            const err = new Error('No estás autorizado para editar este artículo');
            err.status = 403;
            return next(err);
        }

        article.title = req.body.title || article.title;
        article.content = req.body.content || article.content;
        article.category = req.body.category || article.category;
        article.image = req.body.image || article.image;
        article.updatedAt = new Date();

        const updated = await article.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// Elimina un artículo y sus comentarios relacionados usando Transacción
const deleteArticle = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const article = await Article.findById(req.params.id).session(session);
        if (!article) {
            const err = new Error('Artículo no encontrado');
            err.status = 404;
            await session.abortTransaction();
            session.endSession();
            return next(err);
        }

        if (req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
            const err = new Error('No estás autorizado para eliminar este artículo');
            err.status = 403;
            await session.abortTransaction();
            session.endSession();
            return next(err);
        }

        await Comment.deleteMany({ article: article._id }).session(session);
        await article.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Artículo y sus comentarios fueron eliminados correctamente.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

// Trae lista de categorías disponibles
const getCategories = (req, res) => {
    const categories = ['futbol', 'viajes', 'musica', 'peliculas'];
    res.json(categories);
};

module.exports = {
    getFullArticleById,
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getCategories,
};
