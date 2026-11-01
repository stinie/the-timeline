// Import the Post model to retrieve posts from MongoDB.
const Post = require("../models/post");


// Format a post timestamp into a readable Timeline date.
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

// Retrieve posts newest first, prepare readable dates, and render the homepage.
const postsHandler = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .lean()
    .then((posts) => {
      const formattedPosts = posts.map(post => ({
        ...post,
        formattedDate: formatDate(post.createdAt)
      }));

      res.render("index", {
        posts: formattedPosts,
        title: "Home",
        postsError: null
      });
    })
    .catch((err) => {
      console.error("Could not retrieve posts:", err);

      res.status(500).render("index", {
        posts: [],
        title: "Home",
        postsError: "Posts are temporarily unavailable. Please try again later."
      });
    });
};

module.exports = { postsHandler };