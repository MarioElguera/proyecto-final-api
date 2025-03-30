const Comment = require('../models/Comment');

// Get comments of one article
const getCommentsByArticle = async (req, res, next) => {
    try {
        const comments = await Comment.find({ article: req.params.articleId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

// Create comment
const createComment = async (req, res, next) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            article: req.params.articleId,
            author: req.user.id
        });

        const saved = await comment.save();
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
};

// Update comment
const updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            const err = new Error('Comment not found');
            err.status = 404;
            return next(err);
        }

        if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id) {
            const err = new Error('You are not authorized to edit this comment');
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

// Delete comment
const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            const err = new Error('Comment not found');
            err.status = 404;
            return next(err);
        }

        if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id) {
            const err = new Error('You are not authorized to delete this comment');
            err.status = 403;
            return next(err);
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCommentsByArticle,
    createComment,
    updateComment,
    deleteComment
};
