const express = require("express");
const apiRouter = express.Router();
const postsController = require("../../controllers/api/postsController");
const { createPostRules } = require("../../validators/post");
const validate = require("../../middleware/validate");
const { requireApiAuth } = require("../../middleware/requireAuth");
const commentsController = require("../../controllers/api/commentsController");
const { createCommentRules } = require("../../validators/comment");

// server.js adds the /api prefix, so this becomes GET /api/posts.
apiRouter.get("/posts", postsController.getAllPosts);

// Express makes the URL's :id value available as req.params.id.
apiRouter.get("/posts/:id", postsController.getOnePost);

apiRouter.post(
  "/posts",
  requireApiAuth,
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
  requireApiAuth,
  // Updates have the same content requirements as new posts.
  createPostRules,
  validate((req, res, next, message) => {
    // Stop invalid requests before they reach the controller.
    return res.status(422).json({ error: message });
  }),
  postsController.updatePost
);

// PUT generally replaces a resource's editable representation, while PATCH
// applies a partial update. In this project, PUT updates only post content,
// so its behavior is similar to PATCH.
// Both methods preserve the post's author and other unchanged fields.
apiRouter.patch(
  "/posts/:id",
  requireApiAuth,
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

// DELETE needs only the URL ID, so no content validator is required.
apiRouter.delete(
  "/posts/:id",
  requireApiAuth,
  postsController.deletePost
);

// The :postId URL value becomes req.params.postId in the controller.
apiRouter.get(
  "/posts/:postId/comments",
  commentsController.getPostComments
);

apiRouter.post(
  "/posts/:postId/comments",
  requireApiAuth,
  // Reuse the same content rules as the existing website.
  createCommentRules,
  validate((req, res, next, message) => {
    // Invalid content stops here without creating a comment.
    return res.status(422).json({ error: message });
  }),
  commentsController.createComment
);

apiRouter.put(
  "/comments/:id",
  requireApiAuth,
  (req, res, next) => {
    const body = req.body;

    // Expect a JSON object rather than an array or another value.
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(422).json({
        error: "Send a JSON object containing content."
      });
    }

    // Reject protected and unknown fields, even alongside valid content.
    const allowedFields = ["content"];

    if (Object.keys(body).some((field) => !allowedFields.includes(field))) {
      return res.status(422).json({
        error: "Only content may be updated."
      });
    }

    next();
  },
  // Reuse the string, trimming, and minimum-length checks.
  createCommentRules,
  validate((req, res, next, message) => {
    return res.status(422).json({ error: message });
  }),
  commentsController.updateComment
);

// PUT normally replaces a resource's editable representation, while PATCH
// applies a partial update. In this learning project, our PUT endpoint
// updates only the comment's content, so it behaves more like PATCH.
// Both methods reuse the same controller because content is the only
// editable field; the author and parent post remain unchanged.
apiRouter.patch(
  "/comments/:id",
  requireApiAuth,
  (req, res, next) => {
    const body = req.body;

    // Expect an object containing the field to update.
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(422).json({
        error: "Send a JSON object containing content."
      });
    }

    // Reject protected and unknown fields before reaching the controller.
    const allowedFields = ["content"];

    if (Object.keys(body).some((field) => !allowedFields.includes(field))) {
      return res.status(422).json({
        error: "Only content may be updated."
      });
    }

    next();
  },
  // Content is the only editable field, so reuse its existing rules.
  createCommentRules,
  validate((req, res, next, message) => {
    return res.status(422).json({ error: message });
  }),
  // This controller updates only content and preserves the other fields.
  commentsController.updateComment
);

// Deletion needs only the comment ID, so no content validation is required.
apiRouter.delete(
  "/comments/:id",
  requireApiAuth,
  commentsController.deleteComment
);

// Return JSON when no API route matched the request.
apiRouter.use((req, res) => {
  res.status(404).json({
    error: "API endpoint not found."
  });
});

module.exports = apiRouter;