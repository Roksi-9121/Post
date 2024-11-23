const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Підключення до MongoDB
mongoose.connect('mongodb+srv://roksolana9121:wfnodjMcKda7RbEe@cluster0.7uklx.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Завершити процес у разі помилки
    });

// Роутинг
app.use('/api/posts', postRoutes);

// Глобальний обробник помилок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Запуск сервера
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
