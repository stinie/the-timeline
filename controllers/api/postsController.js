const Post = require("../../models/post");

// Retrieve posts from MongoDB and return them as JSON.
const getAllPosts = (req, res, next) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => {
      // An empty database produces { posts: [] }, which is still a success.
      res.status(200).json({ posts });
    })
    // Forward database errors to the existing centralized error handler.
    .catch(next);
};

// Retrieve one post using the ID supplied in the URL.
const getOnePost = (req, res, next) => {
  const postId = req.params.id;

  // Reject malformed IDs before sending a query to MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(400).json({
      error: "Invalid post ID."
    });
  }

  Post.findById(postId)
    .then((post) => {
      // A valid ID format does not guarantee that the post exists.
      if (!post) {
        return res.status(404).json({
          error: "Post not found."
        });
      }

      res.status(200).json({ post });
    })
    // The centralized error handler returns JSON for API errors.
    .catch(next);
};

module.exports = { getAllPosts, getOnePost };