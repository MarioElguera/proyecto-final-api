const express = require('express');
const router = express.Router();
const {
    getAllComments,
    getCommentsByArticle,
    createComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');
const auth = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', getAllComments);
router.get('/:articleId', getCommentsByArticle);

// Rutas privadas
router.put('/:id', auth, updateComment);
router.post('/:articleId', auth, createComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
