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

module.exports = { getAllPosts };