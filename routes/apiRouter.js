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

apiRouter.patch(
  "/posts/:id",
  (req, res, next) => {
    const body = req.body;

    // PATCH needs an object containing at least one field to update.
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(422).json({
        error: "Send a JSON object with at least one editable field."
      });
    }

    const suppliedFields = Object.keys(body);
    const allowedFields = ["content"];

    if (suppliedFields.length === 0) {
      return res.status(422).json({
        error: "Supply at least one editable field."
      });
    }

    // Reject protected and unknown fields instead of silently ignoring them.
    if (suppliedFields.some((field) => !allowedFields.includes(field))) {
      return res.status(422).json({
        error: "Only content may be updated."
      });
    }

    next();
  },
  // Content is currently the only allowed field, so these rules still apply.
  createPostRules,
  validate((req, res, next, message) => {
    return res.status(422).json({ error: message });
  }),
  postsController.patchPost
);

module.exports = apiRouter;