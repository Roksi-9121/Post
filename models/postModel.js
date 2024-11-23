const mongoose = require('mongoose');

// Схема для постів
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true }
});

// Модель для постів
const Post = mongoose.model('Post', postSchema);

// Методи для роботи з базою даних
async function getAllPosts() {
    console.log('Fetching all posts from MongoDB...');
    const posts = await Post.find();
    console.log('Fetched posts from database:', posts); // Лог для перевірки
    return posts;
}

async function getPostById(id) {
    return await Post.findById(new mongoose.Types.ObjectId(id)); // Перетворення id
}

async function addPost({ title, description, author }) {
    const newPost = new Post({ title, description, author });
    return await newPost.save(); // Зберігаємо пост у базу даних
}

async function updatePostByTitle(title, { description, author }) {
    try {
        // Знайти перший пост за title та оновити його поля
        const updatedPost = await Post.findOneAndUpdate(
            { title: title },
            { description, author }, // Змінити description і author
            { new: true, runValidators: true } // Повертає оновлений документ
        );
        return updatedPost;
    } catch (error) {
        console.error(`Error updating post with title "${title}":`, error);
        return null;
    }
}

async function deletePostByTitle(title) {
    try {
        // Знайти перший пост за title і видалити його
        const result = await Post.findOneAndDelete({ title: title });
        return result !== null; // Якщо пост знайдений і видалений, повертається true
    } catch (error) {
        console.error(`Error deleting post with title "${title}":`, error);
        return false;
    }
}

// Експортуємо методи
module.exports = {
    getAllPosts,
    getPostById,
    addPost,
    updatePostByTitle, // Замість updatePost
    deletePostByTitle  // Замість deletePost
};
