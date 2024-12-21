const booksContainer = document.querySelector('.bookmarks');
const loadingIndicator = document.getElementById('loading');

// Fetch books data
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
    const addBtn = document.getElementById('add-btn');
    const modal = document.getElementById('bookmark-modal');
    const editModal = document.getElementById('edit-bookmark-modal'); // New modal for editing
    const saveBtn = document.getElementById('save-bookmark');
    const cancelBtn = document.getElementById('cancel-bookmark');
    const saveEditBtn = document.getElementById('save-edit-bookmark'); // Button for saving edited bookmark
    const cancelEditBtn = document.getElementById('cancel-edit-bookmark'); // Button for cancelling edit
    const bookmarksContainer = document.querySelector('.bookmarks');

    // Load bookmarks from localStorage on page load
    loadBookmarksFromLocalStorage();

    // Show the modal when the "Add Bookmark" button is clicked
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close the modal when the "Cancel" button is clicked (for adding)
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the edit modal when the "Cancel" button is clicked (for editing)
    cancelEditBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Save bookmark when the "Save" button is clicked
    saveBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const coverUrl = document.getElementById('cover').value;
        const bookmarkLink = document.getElementById('link').value;
        const password = document.getElementById('password').value;

        if (title && coverUrl && bookmarkLink) {
            // Create a new bookmark object
            const newBookmark = {
                title: title,
                cover: coverUrl,
                link: bookmarkLink,
                password: password
            };

            // Save the new bookmark to localStorage
            saveBookmarkToLocalStorage(newBookmark);

            // Add the bookmark to the DOM
            addBookmarkToDOM(newBookmark);

            // Close the modal
            modal.style.display = 'none';

            // Clear the form
            document.getElementById('title').value = '';
            document.getElementById('cover').value = '';
            document.getElementById('link').value = '';
            document.getElementById('password').value = '';
        } else {
            alert("Title, cover URL, and bookmark link are required!");
        }
    });

    // Save edited bookmark when "Save Edit" is clicked
    saveEditBtn.addEventListener('click', () => {
        const title = document.getElementById('edit-title').value;
        const coverUrl = document.getElementById('edit-cover').value;
        const bookmarkLink = document.getElementById('edit-link').value;

        if (title && coverUrl && bookmarkLink) {
            // Find the bookmark by its index in localStorage
            const bookmarkId = document.getElementById('edit-id').value; // The unique ID for the bookmark
            const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            const bookmarkToEdit = savedBookmarks.find((bookmark) => bookmark.id === bookmarkId);

            // Update the bookmark data
            bookmarkToEdit.title = title;
            bookmarkToEdit.cover = coverUrl;
            bookmarkToEdit.link = bookmarkLink;

            // Save the updated bookmark list back to localStorage
            localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));

            // Update the DOM with the new data
            updateBookmarkInDOM(bookmarkToEdit);

            // Close the edit modal
            editModal.style.display = 'none';

            // Clear the form
            document.getElementById('edit-title').value = '';
            document.getElementById('edit-cover').value = '';
            document.getElementById('edit-link').value = '';
        } else {
            alert("Title, cover URL, and bookmark link are required!");
        }
    });
});

// Add a bookmark to the DOM
function addBookmarkToDOM(bookmark) {
    const bookmarkDiv = document.createElement('div');
    bookmarkDiv.classList.add('bookmark');
    bookmarkDiv.innerHTML = `
        <a href="${bookmark.link}" target="_blank">
            <img src="${bookmark.cover}" alt="${bookmark.title} Cover" />
            <p>${bookmark.title}</p>
        </a>
        <button class="edit-btn" data-id="${bookmark.id}">Edit</button>
    `;
    booksContainer.appendChild(bookmarkDiv);

    // Attach event listener for the "Edit" button
    bookmarkDiv.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(bookmark);
    });
}

// Update a bookmark in the DOM
function updateBookmarkInDOM(bookmark) {
    const bookmarkDiv = document.querySelector(`.bookmark[data-id="${bookmark.id}"]`);
    bookmarkDiv.innerHTML = `
        <a href="${bookmark.link}" target="_blank">
            <img src="${bookmark.cover}" alt="${bookmark.title} Cover" />
            <p>${bookmark.title}</p>
        </a>
        <button class="edit-btn" data-id="${bookmark.id}">Edit</button>
    `;
    bookmarkDiv.querySelector('.edit-btn').addEventListener('click', () => {
        openEditModal(bookmark);
    });
}

// Load bookmarks from localStorage and display them
function loadBookmarksFromLocalStorage() {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    savedBookmarks.forEach((bookmark) => {
        addBookmarkToDOM(bookmark);
    });
}

// Save a new bookmark to localStorage
function saveBookmarkToLocalStorage(bookmark) {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const newBookmark = { ...bookmark, id: Date.now().toString() }; // Add unique ID for editing
    savedBookmarks.push(newBookmark);
    localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
}

// Open the edit modal with pre-filled data
function openEditModal(bookmark) {
    const editModal = document.getElementById('edit-bookmark-modal');
    document.getElementById('edit-title').value = bookmark.title;
    document.getElementById('edit-cover').value = bookmark.cover;
    document.getElementById('edit-link').value = bookmark.link;
    document.getElementById('edit-id').value = bookmark.id;
    editModal.style.display = 'block';
}
