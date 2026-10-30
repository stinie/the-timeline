const fs = require("node:fs");
const path = require("node:path");

// Load and validate posts from the JSON file.
// If reading, parsing, or validation fails, log the error and keep posts empty.
// Set a friendly error message for the page so the application can keep running.
let posts = [];
let postsError = null;
const postsPath = path.join(__dirname, "../data/posts.json");

try {
  const data = JSON.parse(fs.readFileSync(postsPath, "utf8"));

  if (
    !Array.isArray(data) ||
    data.some(post =>
      !post ||
      (typeof post.id !== "string" && typeof post.id !== "number") ||
      typeof post.username !== "string" ||
      !post.username.trim() ||
      typeof post.authorName !== "string" ||
      !post.authorName.trim() ||
      typeof post.content !== "string" ||
      !post.content.trim() ||
      typeof post.createdAt !== "string" ||
      Number.isNaN(Date.parse(post.createdAt))
    )
  ) {
    console.error("Invalid posts.json data. Using an empty timeline.");
    postsError = "Posts are temporarily unavailable. Please try again later.";
  } else {
    posts = data;
  }
} catch (error) {
  console.error(`Could not load or parse posts.json: ${error.message}`);
  postsError = "Posts are temporarily unavailable. Please try again later.";
}

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

// Sort posts from newest to oldest, prepare readable dates,
// and render the Timeline homepage.
const postsHandler = (req, res) => {
  // Copy the array so sorting does not change the original posts.
  const formattedPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(post => ({
      // Copy all existing properties into a new object.
      // The three dots (...) are JavaScript's spread syntax.
      ...post,

      // Add a readable date without replacing the original createdAt.
      formattedDate: formatDate(post.createdAt)
    }));

  res.render("index", {
    posts: formattedPosts,
    postsError
  });
};

module.exports = { postsHandler };