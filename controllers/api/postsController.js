// Import Post model
const Post = require("../../models/post");
// Look up the development author before creating a post.
const User = require("../../models/user");

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

// Save a new post and return the saved document as JSON.
const createPost = (req, res, next) => {
  const devUserId = process.env.DEV_USER_ID;

  // A missing or malformed development-user ID is a server configuration error.
  if (!devUserId || !/^[a-fA-F0-9]{24}$/.test(devUserId)) {
    return next(new Error("DEV_USER_ID is missing or invalid."));
  }

  User.findById(devUserId)
    .then((user) => {
      // The author must exist before we save a post referencing them.
      if (!user) {
        throw new Error("The User configured by DEV_USER_ID was not found.");
      }

      // Validation has already checked and trimmed the submitted content.
      // The server chooses the author, rather than accepting one from the client.
      const post = new Post({
        content: req.body.content,
        userId: user._id
      });

      // Returning this Promise makes the next .then() wait for MongoDB.
      return post.save();
    })
    .then((savedPost) => {
      res.status(201).json({ post: savedPost });
    })
    // Forward configuration or database errors to the JSON error handler.
    .catch(next);
};

// Find an existing post, update its content, and return the saved post.
const updatePost = (req, res, next) => {
  const postId = req.params.id;

  // Reject malformed IDs before querying MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(400).json({
      error: "Invalid post ID."
    });
  }

  Post.findById(postId)
    .then((post) => {
      // A correctly formatted ID may still have no matching post.
      if (!post) {
        return res.status(404).json({
          error: "Post not found."
        });
      }

      // Validation has already checked and trimmed this content.
      // Update only content, preserving the existing author.
      post.content = req.body.content;

      // Wait for MongoDB to save before sending the success response.
      return post.save().then((savedPost) => {
        res.status(200).json({ post: savedPost });
      });
    })
    // Forward unexpected errors to the existing JSON error handler.
    .catch(next);
};

module.exports = {
  getAllPosts,
  getOnePost,
  createPost,
  updatePost
};