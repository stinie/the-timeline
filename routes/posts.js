// Create an Express router to define routes for posts.
const express = require("express");
const router = express.Router();

// Load the posts from the project's JSON data file.
const posts = require("../data/posts.json");


// Format an ISO timestamp into a readable Timeline date.
// Use UTC so the date does not depend on the server's timezone.
// Add the correct day suffix (st, nd, rd, th).
// Example: 2013-01-15T14:30:00.000Z → January 15th 2013.
// Return a formatted string without changing the original data.
function formatDate(timestamp) {
  const date = new Date(timestamp);

  const day = date.getUTCDate();

  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : { 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th";

  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC"
  });

  const year = date.getUTCFullYear();

  return `${month} ${day}${suffix} ${year}`;
}

// Prepare the posts with readable dates and render the Timeline homepage.
router.get("/", (req, res) => {
  const formattedPosts = posts.map(post => ({
    // Copy all existing properties of this post into a new object.
    // The three dots (...) are JavaScript's spread syntax.
    ...post,
    // Add a readable date without replacing the original createdAt.
    formattedDate: formatDate(post.createdAt)
  }));

  res.render("index", { posts: formattedPosts });
});


// Export the router so server.js can mount it in the Express app.
module.exports = router;