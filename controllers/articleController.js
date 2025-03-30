const Article = require('../models/Article');
const Comment = require('../models/Comment');


const getFullArticleById = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) {
            const err = new Error('Article not found');
            err.status = 404;
            return next(err);
        }

        const comments = await Comment.find({ article: req.params.id }).populate('author', 'username');

        res.json({
            article,
            comments
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/articles?category=musica
const getAllArticles = async (req, res, next) => {
    try {
        const { category } = req.query;

        let filter = {};
        if (category) {
            filter.category = category;
        }

        const articles = await Article.find(filter).populate('author', 'username');
        res.json(articles);
    } catch (error) {
        next(error);
    }
};

// Get one article
const getArticleById = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) {
            const err = new Error('Article not found');
            err.status = 404;
            return next(err);
        }
        res.json(article);
    } catch (error) {
        next(error);
    }
};

// Create article
const createArticle = async (req, res, next) => {
    try {
        const article = new Article({
            title: req.body.title,
            content: req.body.content,
            author: req.user.id
        });

        const saved = await article.save();
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
};

// Update article
const updateArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            const err = new Error('Article not found');
            err.status = 404;
            return next(err);
        }

        // Solo el autor o un admin puede editar
        if (req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
            const err = new Error('You are not authorized to edit this article');
            err.status = 403;
            return next(err);
        }

        // Actualizar campos permitidos
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

// Delete article
const deleteArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            const err = new Error('Article not found');
            err.status = 404;
            return next(err);
        }

        if (req.user.role !== 'admin' && article.author.toString() !== req.user.id) {
            const err = new Error('You are not authorized to delete this article');
            err.status = 403;
            return next(err);
        }

        await article.deleteOne();
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        next(error);
    }
};

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
    getCategories
};
