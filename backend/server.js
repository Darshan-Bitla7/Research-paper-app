const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());

// In-memory array to store saved papers
let savedPapers = [];

// Route to get all saved papers
app.get("/api/saved-papers", (req, res) => {
  res.json(savedPapers);
});

// Route to save a new paper
app.post("/api/save-paper", (req, res) => {
  const paper = req.body;
  // Check for duplicates before saving
  if (!savedPapers.some((p) => p.title === paper.title)) {
    savedPapers.push(paper);
    res.json({ success: true, message: "Paper saved!" });
  } else {
    res.json({ success: false, message: "Paper already saved!" });
  }
});

// Route to delete a saved paper
app.delete("/api/delete-paper/:title", (req, res) => {
  const paperTitle = req.params.title;
  savedPapers = savedPapers.filter((paper) => paper.title !== paperTitle);
  res.json({ success: true, message: "Paper removed!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
