const postModel = require('../models/postModel');

// Контролер для отримання всіх постів
async function getAllPosts(req, res) {
    try {
        console.log('Controller: Fetching all posts...');
        const posts = await postModel.getAllPosts();
        console.log('Controller: Posts fetched:', posts); // Лог для перевірки
        res.json(posts); // Надсилаємо дані клієнту
    } catch (err) {
        console.error('Error in getAllPosts:', err);
        res.status(500).send('Error fetching posts');
    }
}

// Контролер для отримання поста за ID
async function getPostById(req, res) {
    try {
        const post = await postModel.getPostById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.json(post);
    } catch (err) {
        res.status(500).send('Error fetching the post');
    }
}

// Контролер для додавання нового поста
async function addPost(req, res) {
    try {
        const { title, description, author } = req.body;
        if (!title || !description || !author) {
            return res.status(400).send('All fields are required');
        }
        const newPost = await postModel.addPost({ title, description, author });
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).send('Error adding the post');
    }
}

// Контролер для оновлення поста
async function updatePostByTitle(req, res) {
    try {
        const title = req.params.title;
        const { description, author } = req.body;
        const updatedPost = await postModel.updatePostByTitle(title, { description, author });
        if (!updatedPost) {
            return res.status(404).send(`Post with title "${title}" not found`);
        }
        res.json(updatedPost);
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).send('Error updating the post');
    }
}

// Контролер для видалення поста
async function deletePostByTitle(req, res) {
    try {
        const title = req.params.title;
        const success = await postModel.deletePostByTitle(title);
        if (!success) {
            return res.status(404).send(`Post with title "${title}" not found`);
        }
        res.status(200).send(`Post with title "${title}" deleted`);
    } catch (err) {
        console.error('Error in deletePostByTitle:', err);
        res.status(500).send('Error deleting the post');
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    addPost,
    updatePostByTitle,  // Оновлено ім'я функції
    deletePostByTitle  // Оновлено ім'я функції
};
