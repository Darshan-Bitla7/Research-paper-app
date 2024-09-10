const API_URL = "http://localhost:3000/api";

// Function to display saved papers from API
function displaySavedPapers() {
  fetch(`${API_URL}/saved-papers`)
    .then((response) => response.json())
    .then((papers) => {
      const savedDiv = document.getElementById("saved-papers");
      savedDiv.innerHTML = ""; // Clear previous content

      if (papers.length === 0) {
        savedDiv.innerHTML = "<p>No papers saved yet!</p>";
        return;
      }

      papers.forEach((paper, index) => {
        const paperDiv = document.createElement("div");
        paperDiv.classList.add("paper");

        paperDiv.innerHTML = `
                    <h3>${paper.title}</h3>
                    <p><strong>Authors:</strong> ${paper.authors}</p>
                    <p><strong>Year:</strong> ${paper.year}</p>
                    <p><strong>Citations:</strong> ${paper.citationCount}</p>
                    <div class="remove-btn">
                      <img src="filled-bookmark.png" />
                    </div>
                `;

        const removeBtn = paperDiv.querySelector(".remove-btn");
        removeBtn.addEventListener("click", () => removePaper(paper.title));

        savedDiv.appendChild(paperDiv);
      });
    });
}

// Function to remove a paper via API
function removePaper(title) {
  fetch(`${API_URL}/delete-paper/${title}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      displaySavedPapers(); // Re-render the saved papers
    });
}

// Call displaySavedPapers on page load
window.onload = displaySavedPapers;
