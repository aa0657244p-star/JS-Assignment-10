const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.post('/', postController.createPost);
router.delete('/:postId', postController.deletePost);
router.get('/details', postController.getAllPostsWithDetails);
router.get('/comment-count', postController.getPostsWithCommentCount);

module.exports = router;