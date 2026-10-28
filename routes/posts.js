// Create an Express router to define routes for posts.
const express = require("express");
const router = express.Router();

// Load the posts from the project's JSON data file.
const posts = require("../data/posts.json");

// Define the GET route that will load and return the posts.
router.get("/", (req, res) => {
  console.log(posts);
  res.render("index", { posts });
});

// Export the router so server.js can mount it in the Express app.
module.exports = router;