// Import the Post model to find the post receiving the comment.
const Post = require("../models/post");

// Import the Comment model to create and save comments.
const Comment = require("../models/comment");

// Import the User model to verify that the comment author exists.
const User = require("../models/user");

// Handler for creating a new comment on a post.
const createCommentHandler = (req, res, next) => {
  const devUserId = process.env.DEV_USER_ID;
  // TEST ONLY: Simulate an author who does not exist in MongoDB.
  // Restore the original DEV_USER_ID line after testing.
  // const devUserId = "000000000000000000000000";
  const postId = req.params.id;
  const { content } = req.body || {};

  // DEV_USER_ID identifies the development author.
  // Forward configuration errors to the centralized error handler.
  if (!devUserId || !/^[a-fA-F0-9]{24}$/.test(devUserId)) {
    return next(new Error("DEV_USER_ID is missing or invalid."));
  }

  // Invalid post ID: show the existing 404 page.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    const error = new Error("Post not found");
    error.status = 404;
    return next(error);
  }

  // Verify that the development author exists before finding the post.
  User.findById(devUserId)
    .then(user => {
      if (!user) {
        throw new Error("DEV_USER_ID does not reference an existing user.");
      }
      // Find the post by ID to ensure it exists before adding a comment.
      return Post.findById(postId);
    })
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.status = 404;
        return next(error);
      }

      // Create a new comment associated with the found post.
      const newComment = new Comment({
        postId: post._id,
        userId: devUserId,
        content: content.trim()
      });

      // Save the new comment to the database.
      return newComment.save();

      // TEST: Temporarily replace newComment.save() with this line to simulate a saving error.
      // Restore newComment.save() after testing.
      // return Promise.reject(new Error("TEST: comment saving failed"));

    })
    .then((savedComment) => {
      if (!savedComment) return;
      // Redirect to the Timeline after successfully adding a comment.
      res.redirect("/posts?success=commented");
    })
    .catch(next);
};

module.exports = {
  createCommentHandler
};