const { Comment, User, Post } = require('../models/associations');
const { Op } = require('sequelize');

exports.bulkCreateComments = async (req, res) => {
    try {
        await Comment.bulkCreate(req.body);
        res.status(201).json({ message: 'Comments created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId, content } = req.body;
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this comment.' });
        }
        comment.content = content;
        await comment.save();
        res.status(200).json({ message: 'Comment updated.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findOrCreateComment = async (req, res) => {
    try {
        const { postId, userid, content } = req.body;
        const [comment] = await Comment.findOrCreate({
            where: { postId, userId: userid, content },
            defaults: { postId, userId: userid, content }
        });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchComments = async (req, res) => {
    try {
        const { word } = req.params;
        const { count, rows } = await Comment.findAndCountAll({
            where: { content: { [Op.like]: `%${word}%` } }
        });
        res.status(200).json({ matchedComments: rows, count: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecentComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.findAll({
            where: { postId },
            order: [['createdAt', 'DESC']],
            limit: 3,
            attributes: ['id', 'content', 'createdAt']
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCommentWithDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByPk(id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Post, attributes: ['id', 'title', 'content'] }
            ]
        });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};