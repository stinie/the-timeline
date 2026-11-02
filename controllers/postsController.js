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

// Save a new post with Christine as the default author, then return to the Timeline.
const createPostHandler = (req, res) => {
  const post = new Post({
    username: "stinie",
    authorName: "Christine Fürst",
    content: req.body.content
  });

  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Could not create post:", err);

      const status = err.name === "ValidationError" ? 400 : 500;
      res.status(status).send(
        status === 400
          ? "Please enter a message of at least 25 characters."
          : "Your post could not be saved. Please try again later."
      );
    });
};

// Retrieve one post by its URL ID and render the full message.
const showPostHandler = (req, res) => {
  Post.findById(req.params.id)
    .lean()
    .then((post) => {
      if (!post) {
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }

      res.render("show", {
        title: "Show post",
        post: {
          ...post,
          formattedDate: formatDate(post.createdAt)
        }
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }

      console.error("Could not retrieve post:", err);
      // Display the retrieval error within the shared Timeline layout.
      res.status(500).render("index", {
        posts: [],
        title: "Post unavailable",
        postsError: "This post is temporarily unavailable. Please try again later."
      });
    });
};

module.exports = { postsHandler, createPostHandler, showPostHandler };