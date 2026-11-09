const Post = require("../../models/post");
const Comment = require("../../models/comment");
const User = require("../../models/user");

// Return all comments belonging to one existing post.
const getPostComments = (req, res, next) => {
  const postId = req.params.postId;

  // Reject malformed IDs before querying MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(400).json({
      error: "Invalid post ID."
    });
  }

  Post.findById(postId)
    .then((post) => {
      // Check the parent post so a missing post is different from no comments.
      if (!post) {
        return res.status(404).json({
          error: "Post not found."
        });
      }

      // Filter by the parent ID and match the website's oldest-first order.
      return Comment.find({ postId: post._id })
        .sort({ createdAt: 1 })
        .then((comments) => {
          // find() returns an empty array when the post has no comments.
          res.status(200).json({ comments });
        });
    })
    // Forward unexpected database errors to the JSON error handler.
    .catch(next);
};

// Create a comment linked to an existing post and development author.
const createComment = (req, res, next) => {
  const postId = req.params.postId;
  const devUserId = process.env.DEV_USER_ID;

  // Reject malformed post IDs before querying MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(400).json({
      error: "Invalid post ID."
    });
  }

  // The author comes from server configuration, not the request body.
  if (!devUserId || !/^[a-fA-F0-9]{24}$/.test(devUserId)) {
    return next(new Error("DEV_USER_ID is missing or invalid."));
  }

  Post.findById(postId)
    .then((post) => {
      // Do not create a comment referencing a missing post.
      if (!post) {
        return res.status(404).json({
          error: "Post not found."
        });
      }

      return User.findById(devUserId)
        .then((user) => {
          if (!user) {
            throw new Error(
              "The User configured by DEV_USER_ID was not found."
            );
          }

          // Validation has already checked and trimmed the content.
          // Explicitly choose the parent and author rather than copying the body.
          const comment = new Comment({
            content: req.body.content,
            postId: post._id,
            userId: user._id
          });

          return comment.save();
        })
        .then((savedComment) => {
          // Respond only after MongoDB has saved the comment.
          res.status(201).json({ comment: savedComment });
        });
    })
    .catch(next);
};

// Update a comment's content while preserving its author and parent post.
const updateComment = (req, res, next) => {
  const commentId = req.params.id;

  // Reject malformed IDs before querying MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(commentId)) {
    return res.status(400).json({
      error: "Invalid comment ID."
    });
  }

  Comment.findById(commentId)
    .then((comment) => {
      // A correctly formatted ID may still have no matching comment.
      if (!comment) {
        return res.status(404).json({
          error: "Comment not found."
        });
      }

      // Validation has already checked and trimmed the content.
      // Assign only this field so the author and parent remain unchanged.
      comment.content = req.body.content;

      // Wait for MongoDB to save before confirming the update.
      return comment.save().then((savedComment) => {
        res.status(200).json({ comment: savedComment });
      });
    })
    .catch(next);
};

module.exports = {
  getPostComments,
  createComment,
  updateComment
};