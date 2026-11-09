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

module.exports = { getPostComments };