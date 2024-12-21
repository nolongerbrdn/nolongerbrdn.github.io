const booksContainer = document.querySelector('.bookmarks');
fetch('data/books.json') // Replace 'manga.json' with 'books.json'
    .then((response) => response.json())
    .then((books) => {
        books.forEach((book) => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('bookmark');
            bookDiv.innerHTML = `
                    <a href="${book.link}" target="_blank">
                        <img src="${book.cover}" alt="${book.title} Cover" />
                        <p>${book.title}</p>
                    </a>
                `;
            booksContainer.appendChild(bookDiv);
        });
    })
    .catch((error) => console.error('Error loading book data:', error));
