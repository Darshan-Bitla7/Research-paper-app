const API_URL = "http://localhost:3000/api"; // Node.js backend URL

// Function to search for papers using CrossRef API
function searchPapers(query) {
  const loader = document.getElementById("loader");
  const resultsDiv = document.getElementById("search-results");

  // Show loader and clear previous results
  loader.style.display = "block";
  resultsDiv.innerHTML = "";

  fetch(`https://api.crossref.org/works?query=${query}&rows=10`)
    .then((response) => response.json())
    .then((data) => {
      const papers = data.message.items.map((item) => ({
        title: item.title[0],
        authors: item.author
          ? item.author
              .map((author) => author.given + " " + author.family)
              .join(", ")
          : "Unknown",
        year: item.published ? item.published["date-parts"][0][0] : "Unknown",
        citationCount: item["is-referenced-by-count"] || 0,
      }));
      displayResults(papers);
    })
    .catch((error) => {
      console.error("Error fetching data from CrossRef:", error);
    })
    .finally(() => {
      // Hide the loader when the process is done (either success or failure)
      loader.style.display = "none";
    });
}

// Handle search button click
document.getElementById("search-button").addEventListener("click", function () {
  const searchInput = document.getElementById("search-input").value;
  if (searchInput.trim()) {
    searchPapers(searchInput);
  }
});

// Function to display search results
function displayResults(papers) {
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Fetch saved papers to determine the bookmark state
  fetch(`${API_URL}/saved-papers`)
    .then((response) => response.json())
    .then((savedPapers) => {
      papers.forEach((paper) => {
        const paperDiv = document.createElement("div");
        paperDiv.classList.add("paper");

        // Check if the paper is already saved
        let isSaved = savedPapers.some(
          (savedPaper) => savedPaper.title === paper.title
        );

        // Define the bookmark image based on whether the paper is saved
        let bookmarkImage = isSaved ? "filled-bookmark.png" : "bookmark.jpg";

        // Create the HTML for the paper card
        paperDiv.innerHTML = `
          <h3>${paper.title}</h3>
          <p><strong>Authors:</strong> ${paper.authors}</p>
          <p><strong>Year:</strong> ${paper.year}</p>
          <p><strong>Citations:</strong> ${paper.citationCount}</p>
          <div class="bookmark-btn">
            <img src="${bookmarkImage}" alt="Bookmark" />
          </div>
        `;

        // Add event listener to toggle the bookmark on click
        const bookmarkBtn = paperDiv.querySelector(".bookmark-btn img");
        bookmarkBtn.addEventListener("click", () => {
          if (isSaved) {
            removePaper(paper.title).then(() => {
              bookmarkBtn.src = "bookmark.jpg"; // Change to empty bookmark
              isSaved = false; // Update isSaved state
            });
          } else {
            savePaper(paper).then(() => {
              bookmarkBtn.src = "filled-bookmark.png"; // Change to filled bookmark
              isSaved = true; // Update isSaved state
            });
          }
        });

        resultsDiv.appendChild(paperDiv);
      });
    });
}

// Function to save a paper to the backend via API
function savePaper(paper) {
  return fetch(`${API_URL}/save-paper`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paper),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error saving paper:", error);
    });
}
// Function to remove a paper from the backend via API
function removePaper(title) {
  return fetch(`${API_URL}/delete-paper/${title}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error removing paper:", error);
    });
}
