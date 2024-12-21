const fetchBookmarks = async () => {
    try {
        const response = await fetch(
            "https://brdnsbookmarkapi.netlify.app/netlify/functions/fetch-bookmarks",
            { method: "POST" }
        );
        const data = await response.json();
        console.log("Fetched Bookmarks:", data.bookmarks);
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
    }
};

fetchBookmarks();
