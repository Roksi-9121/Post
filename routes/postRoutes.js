const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Налаштування маршрутів
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.addPost);
router.put('/:title', postController.updatePostByTitle);
router.delete('/:title', postController.deletePostByTitle);

module.exports = router;
