const express = require('express');
const router = express.Router();
const {
    getCommentsByArticle,
    createComment,
    deleteComment
} = require('../controllers/commentController');
const auth = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/:articleId', getCommentsByArticle);

// Rutas privadas
router.put('/:id', auth, updateComment);
router.post('/:articleId', auth, createComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
