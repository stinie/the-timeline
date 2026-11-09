const express = require("express");
const apiRouter = express.Router();
const postsController = require("../controllers/api/postsController");
const { createPostRules } = require("../validators/post");
const validate = require("../middleware/validate");

// server.js adds the /api prefix, so this becomes GET /api/posts.
apiRouter.get("/posts", postsController.getAllPosts);

// Express makes the URL's :id value available as req.params.id.
apiRouter.get("/posts/:id", postsController.getOnePost);

apiRouter.post(
  "/posts",
  // Check that content is text, trim it, and require at least 25 characters.
  createPostRules,
  validate((req, res, next, message) => {
    // Invalid content stops here, before the controller can save anything.
    return res.status(422).json({ error: message });
  }),
  postsController.createPost
);

apiRouter.put(
  "/posts/:id",
  // Updates have the same content requirements as new posts.
  createPostRules,
  validate((req, res, next, message) => {
    // Stop invalid requests before they reach the controller.
    return res.status(422).json({ error: message });
  }),
  postsController.updatePost
);

module.exports = apiRouter;