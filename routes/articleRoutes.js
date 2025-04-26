const express = require('express');
const router = express.Router();

// Controladores de 'articles'
const {
    getFullArticleById,
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getCategories
} = require('../controllers/articleController');
const auth = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.get('/:id/full', getFullArticleById);
router.get('/categories/list', getCategories);

// Rutas privadas (requieren login)
router.post('/', auth, createArticle);
router.put('/:id', auth, updateArticle);
router.delete('/:id', auth, deleteArticle);

module.exports = router;
