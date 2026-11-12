const Post = require("../../models/post");
const Comment = require("../../models/comment");

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
      // Distinguish a missing post from a post without comments.
      if (!post) {
        return res.status(404).json({
          error: "Post not found."
        });
      }

      // Match the website's oldest-first order.
      return Comment.find({ postId: post._id })
        .sort({ createdAt: 1 })
        .then((comments) => {
          res.status(200).json({ comments });
        });
    })
    .catch(next);
};

// Create a comment linked to an existing post and authenticated author.
const createComment = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  // Reject malformed post IDs before querying MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(400).json({
      error: "Invalid post ID."
    });
  }

  Post.findById(postId)
    .then((post) => {
      // Do not create a comment referencing a missing post.
      if (!post) {
        return res.status(404).json({
          error: "Post not found."
        });
      }

      // Choose the parent and authenticated author explicitly.
      const comment = new Comment({
        content: req.body.content,
        postId: post._id,
        userId
      });

      // Respond only after MongoDB has saved the comment.
      return comment.save().then((savedComment) => {
        res.status(201).json({
          comment: savedComment
        });
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
      if (!comment) {
        return res.status(404).json({
          error: "Comment not found."
        });
      }

      // Only the author may update this comment.
      if (String(comment.userId) !== String(req.user._id)) {
        return res.status(403).json({
          error: "You can only edit or delete your own comments."
        });
      }

      // Validation has already checked and trimmed the content.
      // Preserve the existing author and parent post.
      comment.content = req.body.content;

      return comment.save().then((savedComment) => {
        res.status(200).json({
          comment: savedComment
        });
      });
    })
    .catch(next);
};

// Delete one comment without changing its parent post or other comments.
const deleteComment = (req, res, next) => {
  const commentId = req.params.id;

  // Reject malformed IDs before querying MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(commentId)) {
    return res.status(400).json({
      error: "Invalid comment ID."
    });
  }

  // Retrieve the comment before checking ownership.
  Comment.findById(commentId)
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({
          error: "Comment not found."
        });
      }

      // Only the author may delete this comment.
      if (String(comment.userId) !== String(req.user._id)) {
        return res.status(403).json({
          error: "You can only edit or delete your own comments."
        });
      }

      // Delete only this comment after ownership is confirmed.
      return Comment.findByIdAndDelete(comment._id).then(() => {
        res.status(200).json({
          message: "Comment deleted successfully."
        });
      });
    })
    .catch(next);
};

// Make the controllers available to the API router.
module.exports = {
  getPostComments,
  createComment,
  updateComment,
  deleteComment
};