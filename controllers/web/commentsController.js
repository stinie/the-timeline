// Import the Post model to find the post receiving the comment.
const Post = require("../../models/post");

// Import the Comment model to create and save comments.
const Comment = require("../../models/comment");

// Save a new comment with the authenticated user as its author.
const createCommentHandler = (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.id;
  const { content } = req.body || {};

  // Invalid post ID: show the existing 404 page.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    const error = new Error("Post not found");
    error.status = 404;
    return next(error);
  }

  // Ensure the parent post exists before adding a comment.
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.status = 404;
        return next(error);
      }

      // Associate the comment with its post and authenticated author.
      const newComment = new Comment({
        postId: post._id,
        userId,
        content: content.trim()
      });

      return newComment.save();
    })
    .then((savedComment) => {
      // Stop if the earlier handler forwarded a missing-post error.
      if (!savedComment) return;

      res.redirect("/posts?success=commented");
    })
    .catch(next);
};

module.exports = {
  createCommentHandler
};