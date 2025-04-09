const express = require('express');
const router = express.Router();
const {
    getComments,
    getCommentsByArticle,
    createComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');
const auth = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', getComments);
router.get('/:articleId', getCommentsByArticle);

// Rutas privadas
router.put('/:id', auth, updateComment);
router.post('/:articleId', auth, createComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
