// Import Post model
const Post = require("../../models/post");
// Comments are stored separately and must be removed explicitly.
const Comment = require("../../models/comment");

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

// Save a new post with the authenticated author and return it as JSON.
const createPost = (req, res, next) => {
  const userId = req.user._id;

  // Validation has already checked and trimmed the submitted content.
  // Use the authenticated author, rather than accepting one from the client.
  const post = new Post({
    content: req.body.content,
    userId
  });

  post.save()
    .then((savedPost) => {
      // Respond only after MongoDB has saved the post.
      res.status(201).json({ post: savedPost });
    })
    // Forward database errors to the JSON error handler.
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

// PATCH has its own controller so partial updates can evolve separately from PUT.
const patchPost = (req, res, next) => {
  const postId = req.params.id;

  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(400).json({
      error: "Invalid post ID."
    });
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          error: "Post not found."
        });
      }

      // Only assign fields explicitly supplied by the client.
      // Future editable fields can get their own checks here.
      if (Object.hasOwn(req.body, "content")) {
        post.content = req.body.content;
      }

      // Saving this document preserves fields we have not assigned.
      return post.save().then((savedPost) => {
        res.status(200).json({ post: savedPost });
      });
    })
    .catch(next);
};

// Delete one post together with all comments belonging to it.
const deletePost = (req, res, next) => {
  const postId = req.params.id;

  // Reject malformed IDs before querying MongoDB.
  if (!/^[a-fA-F0-9]{24}$/.test(postId)) {
    return res.status(400).json({
      error: "Invalid post ID."
    });
  }

  Post.findById(postId)
    .then((post) => {
      // Check existence before attempting either deletion.
      if (!post) {
        return res.status(404).json({
          error: "Post not found."
        });
      }

      // MongoDB does not automatically delete comments referencing a post.
      // Match this post's ID so comments on other posts remain untouched.
      return Comment.deleteMany({ postId: post._id })
        .then(() => {
          return Post.findByIdAndDelete(post._id);
        })
        .then(() => {
          // Confirm success only after both database operations finish.
          res.status(200).json({
            message: "Post and associated comments deleted successfully."
          });
        });
    })
    .catch(next);
};

module.exports = {
  getAllPosts,
  getOnePost,
  createPost,
  updatePost,
  patchPost,
  deletePost
};