// Import the Post model to find the post receiving the comment.
const Post = require("../models/post");

// Import the Comment model to create and save comments.
const Comment = require("../models/comment");

const createCommentHandler = (req, res) => {
  const devUserId = process.env.DEV_USER_ID;
  const postId = req.params.id;
  const { content } = req.body;

  // Require a valid post ObjectId before querying MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(400).send("Invalid post ID.");
  }

  // Require a valid ObjectId before querying MongoDB.
  if (!devUserId || !/^[a-fA-F0-9]{24}$/.test(devUserId)) {
    console.error("DEV_USER_ID is missing or invalid.");
    return res.status(500).send(
      "Your comment could not be saved. Please try again later."
    );
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
      console.error("Could not create comment:", err);

      if (res.headersSent) return;

      const status = err.name === "ValidationError" ? 400 : 500;
      res.status(status).send(
        status === 400
          ? "Please enter a comment of at least 25 characters."
          : "Your comment could not be saved. Please try again later."
      );
    });
};

module.exports = {
  createCommentHandler
};