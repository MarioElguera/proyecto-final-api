const mongoose = require('mongoose');
const Article = require('../models/Article');
const Comment = require('../models/Comment');

/**
 * Manejador de errores personalizados
 */
const createError = (message, status = 500) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

/**
 * GET /articles/full/:id
 * Trae un artículo con todos los comentarios relacionados
 */
const getFullArticleById = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) return next(createError('Artículo no encontrado', 404));

        const comments = await Comment.find({ article: req.params.id }).populate('author', 'username');
        res.json({ article, comments });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /articles
 * Trae todos los artículos, con filtro opcional por categoría
 */
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

/**
 * GET /articles/:id
 * Trae un artículo por su ID
 */
const getArticleById = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) return next(createError('Artículo no encontrado', 404));
        res.json(article);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /articles
 * Crea un nuevo artículo
 */
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
        next(createError('Error al crear el artículo. Revisa los campos ingresados.', 400));
    }
};

/**
 * PUT /articles/:id
 * Actualiza un artículo existente
 */
const updateArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return next(createError('Artículo no encontrado', 404));

        const notAuthorized = req.user.role !== 'admin' && article.author.toString() !== req.user.id;
        if (notAuthorized) return next(createError('No estás autorizado para editar este artículo', 403));

        article.title = req.body.title || article.title;
        article.content = req.body.content || article.content;
        article.category = req.body.category || article.category;
        article.image = req.body.image || article.image;
        article.updatedAt = new Date();

        const updated = await article.save();
        res.json(updated);
    } catch (error) {
        next(createError('Error al actualizar el artículo.', 400));
    }
};

/**
 * DELETE /articles/:id
 * Elimina un artículo y sus comentarios relacionados (transacción)
 */
const deleteArticle = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const article = await Article.findById(req.params.id).session(session);
        if (!article) {
            await session.abortTransaction();
            session.endSession();
            return next(createError('Artículo no encontrado', 404));
        }

        const notAuthorized = req.user.role !== 'admin' && article.author.toString() !== req.user.id;
        if (notAuthorized) {
            await session.abortTransaction();
            session.endSession();
            return next(createError('No estás autorizado para eliminar este artículo', 403));
        }

        await Comment.deleteMany({ article: article._id }).session(session);
        await article.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Artículo y sus comentarios fueron eliminados correctamente.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(createError('Error al eliminar el artículo.', 500));
    }
};

/**
 * GET /articles/categories/list
 * Retorna la lista de categorías disponibles
 */
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
