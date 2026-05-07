const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router.post('/', commentController.bulkCreateComments);
router.patch('/:commentId', commentController.updateComment);
router.post('/find-or-create', commentController.findOrCreateComment);
router.get('/search/:word', commentController.searchComments);
router.get('/newest/:postId', commentController.getRecentComments);
router.get('/details/:id', commentController.getCommentWithDetails);

module.exports = router;