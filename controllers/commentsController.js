// Import the Post model to find the post receiving the comment.
const Post = require("../models/post");

// Import the Comment model to create and save comments.
const Comment = require("../models/comment");

// Handler for creating a new comment on a post.
const createCommentHandler = (req, res, next) => {
  const devUserId = process.env.DEV_USER_ID;
  const postId = req.params.id;
  const { content } = req.body || {};

  // DEV_USER_ID identifies the development author.
  // Forward configuration errors to the centralized error handler.
  if (!devUserId || !/^[a-fA-F0-9]{24}$/.test(devUserId)) {
    return next(new Error("DEV_USER_ID is missing or invalid."));
  }

  // Invalid post ID: show the existing 404 page.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(404).render("404", {
      title: "Post not found"
    });
  }

  // Require at least 25 characters for a comment.
  if (typeof content !== "string" || content.trim().length < 25) {
    return res.status(400).send(
      "Comment must contain at least 25 characters."
    );
  }

  // Find the post by ID to ensure it exists before adding a comment.
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        res.status(404).send("Post not found.");
        return null;
      }

      // Create a new comment associated with the found post.
      const newComment = new Comment({
        postId: post._id,
        userId: devUserId,
        content: content.trim()
      });

      // Save the new comment to the database.
      return newComment.save();
    })
    .then((savedComment) => {
      if (!savedComment) return;
      // Redirect to the Timeline after successfully adding a comment.
      res.redirect("/posts");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send(
          "Please enter a comment of at least 25 characters."
        );
      }

      next(err);
    });
};

module.exports = {
  createCommentHandler
};