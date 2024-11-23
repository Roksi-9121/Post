document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('postList');
    const postForm = document.getElementById('postForm');

    // Завантажити дописи
    function loadPosts() {
        fetch('/api/posts')
            .then(res => res.json())
            .then(posts => {
                postList.innerHTML = '';
                posts.forEach(post => {
                    const li = document.createElement('li');
                    li.dataset.title = post.title; // Додаємо title для зручності

                    li.innerHTML = `
                        <h3 contenteditable="false" class="editable" data-field="title">${post.title}</h3>
                        <p contenteditable="false" class="editable" data-field="description">${post.description}</p>
                        <p><strong>Author:</strong> <span contenteditable="false" class="editable" data-field="author">${post.author}</span></p>
                        <div class="button-container">
                            <button class="edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="save" style="display: none;">Save</button>
                            <button class="delete">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    `;
                    postList.appendChild(li);

                    // Додаємо слухачі подій
                    li.querySelector('.edit').addEventListener('click', () => toggleEditMode(li, true));
                    li.querySelector('.save').addEventListener('click', () => savePost(li));
                    li.querySelector('.delete').addEventListener('click', () => deletePost(post.title)); // Видаляємо за title
                });
            });
    }

    // Увімкнути/вимкнути режим редагування
    function toggleEditMode(li, isEditing) {
        li.querySelectorAll('.editable').forEach((field) => {
            field.contentEditable = isEditing;
        });
        li.querySelector('.edit').style.display = isEditing ? 'none' : 'inline-block';
        li.querySelector('.save').style.display = isEditing ? 'inline-block' : 'none';
    }

    // Зберегти зміни
    function savePost(li) {
        const title = li.dataset.title;
        if (!title) {
            console.error('Title is invalid or undefined');
            return;
        }
        const updatedPost = {};
        li.querySelectorAll('.editable').forEach((field) => {
            const fieldName = field.dataset.field;
            updatedPost[fieldName] = field.textContent.trim();
        });

        fetch(`/api/posts/${title}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPost),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to update post');
                }
                return res.json();
            })
            .then(() => {
                toggleEditMode(li, false);
                loadPosts(); // Оновити список дописів
            })
            .catch((err) => console.error(err));
    }

    // Видалити допис
    function deletePost(title) {
        if (!title) {
            console.error('Title is invalid or undefined');
            return;
        }

        fetch(`/api/posts/${title}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to delete post');
                }
                loadPosts(); // Оновити список дописів
            })
            .catch((err) => console.error(err));
    }

    // Зберегти новий пост
    postForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Забороняємо перезавантаження сторінки

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const author = document.getElementById('author').value.trim();

        if (!title || !description || !author) {
            alert('Please fill out all fields before submitting.');
            return;
        }

        const newPost = { title, description, author };

        fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to save post');
                }
                return res.json();
            })
            .then(() => {
                postForm.reset(); // Очищуємо форму після збереження
                loadPosts(); // Оновлюємо список дописів
            })
            .catch((err) => console.error(err));
    });

    // Початкове завантаження дописів
    loadPosts();
});
