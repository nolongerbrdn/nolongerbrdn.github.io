const booksContainer = document.querySelector('.bookmarks');
const loadingIndicator = document.getElementById('loading');

// Fetch and load books
fetch('data/books.json')
    .then((response) => response.json())
    .then((books) => {
        if (books.length === 0) {
            const noBooksMessage = document.createElement('p');
            noBooksMessage.textContent = 'No books available at the moment.';
            booksContainer.appendChild(noBooksMessage);
        } else {
            books.forEach((book) => {
                addBookmarkToDOM(book);
            });
        }
    })
    .catch((error) => {
        console.error('Error loading book data:', error);
    });

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('bookmark-modal'); // Add Bookmark modal
    const editModal = document.getElementById('edit-bookmark-modal'); // Edit Bookmark modal
    const addBtn = document.getElementById('add-btn');
    const saveBtn = document.getElementById('save-bookmark');
    const cancelBtn = document.getElementById('cancel-bookmark');
    const saveEditBtn = document.getElementById('save-edit-bookmark');
    const cancelEditBtn = document.getElementById('cancel-edit-bookmark');
    const removeEditBtn = document.getElementById('remove-bookmark');

    // Load bookmarks from localStorage
    loadBookmarksFromLocalStorage();

    // Show Add Bookmark modal
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Cancel Add Bookmark modal
    cancelBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Show Edit Bookmark modal when "Edit" is clicked
    // Modify this part
    document.querySelector('.bookmarks').addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const bookmarkDiv = event.target.closest('.bookmark');
            const bookmarkId = bookmarkDiv.getAttribute('data-id');
            const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            const bookmark = savedBookmarks.find((bookmark) => bookmark.id === bookmarkId);
            openEditModal(bookmark);
        }
    });

    // Cancel Edit Bookmark modal
    cancelEditBtn.addEventListener('click', () => {
        editModal.style.display = "none";
    });

    // Save new bookmark
    saveBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const coverUrl = document.getElementById('cover').value;
        const bookmarkLink = document.getElementById('link').value;
        const password = document.getElementById('password').value;

        if (title && coverUrl && bookmarkLink) {
            const newBookmark = {
                title: title,
                cover: coverUrl,
                link: bookmarkLink,
                password: password,
                status: 'Active'
            };

            saveBookmarkToLocalStorage(newBookmark);
            addBookmarkToDOM(newBookmark);

            modal.style.display = "none";

            // Clear input fields
            document.getElementById('title').value = '';
            document.getElementById('cover').value = '';
            document.getElementById('link').value = '';
            document.getElementById('password').value = '';
        } else {
            alert("Title, cover URL, and bookmark link are required!");
        }
    });

    // Save edited bookmark
    saveEditBtn.addEventListener('click', () => {
        const title = document.getElementById('edit-title').value;
        const coverUrl = document.getElementById('edit-cover').value;
        const bookmarkLink = document.getElementById('edit-link').value;
        const status = document.getElementById('edit-status').value;

        const bookmarkId = document.getElementById('edit-id').value;

        if (title && coverUrl && bookmarkLink) {
            const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            const bookmarkToEdit = savedBookmarks.find((bookmark) => bookmark.id === bookmarkId);

            bookmarkToEdit.title = title;
            bookmarkToEdit.cover = coverUrl;
            bookmarkToEdit.link = bookmarkLink;
            bookmarkToEdit.status = status;

            localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));

            updateBookmarkInDOM(bookmarkToEdit);
            editModal.style.display = "none";
        } else {
            alert("Title, cover URL, and bookmark link are required!");
        }
    });

    // Remove bookmark functionality
    removeEditBtn.addEventListener('click', () => {
        const bookmarkId = document.getElementById('edit-id').value;
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const updatedBookmarks = savedBookmarks.filter((bookmark) => bookmark.id !== bookmarkId);

        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));

        const bookmarkDiv = document.querySelector(`.bookmark[data-id="${bookmarkId}"]`);
        bookmarkDiv.remove();

        editModal.style.display = "none";
    });
});

// Open the edit modal with pre-filled bookmark data
function openEditModal(bookmark) {
    const editModal = document.getElementById('edit-bookmark-modal');
    document.getElementById('edit-title').value = bookmark.title;
    document.getElementById('edit-cover').value = bookmark.cover;
    document.getElementById('edit-link').value = bookmark.link;
    document.getElementById('edit-status').value = bookmark.status;
    document.getElementById('edit-id').value = bookmark.id;

    editModal.style.display = 'block';
}


// Add bookmark to the DOM
function addBookmarkToDOM(bookmark) {
    const bookmarkDiv = document.createElement('div');
    bookmarkDiv.classList.add('bookmark');
    bookmarkDiv.setAttribute('data-id', bookmark.id);

    bookmarkDiv.innerHTML = `
        <a href="${bookmark.link}" target="_blank">
            <img src="${bookmark.cover}" alt="${bookmark.title} Cover" />
            <p>${bookmark.title}</p>
        </a>
        <button class="edit-btn">Edit</button>
    `;

    booksContainer.appendChild(bookmarkDiv);
}

// Update bookmark in the DOM after editing
function updateBookmarkInDOM(bookmark) {
    const bookmarkDiv = document.querySelector(`.bookmark[data-id="${bookmark.id}"]`);
    bookmarkDiv.innerHTML = `
        <a href="${bookmark.link}" target="_blank">
            <img src="${bookmark.cover}" alt="${bookmark.title} Cover" />
            <p>${bookmark.title}</p>
        </a>
        <button class="edit-btn">Edit</button>
    `;

    // Re-attach the event listener for "Edit"
    bookmarkDiv.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(bookmark);
    });
}

// Load bookmarks from localStorage
function loadBookmarksFromLocalStorage() {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    savedBookmarks.forEach((bookmark) => {
        addBookmarkToDOM(bookmark);
    });
}

// Save new bookmark to localStorage
function saveBookmarkToLocalStorage(bookmark) {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const newBookmark = { ...bookmark, id: Date.now().toString() };
    savedBookmarks.push(newBookmark);
    localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
}
