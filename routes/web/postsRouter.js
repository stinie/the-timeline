// Create an Express router to define routes for posts.
const express = require("express");
const postsRouter = express.Router();
const postsController = require("../../controllers/web/postsController");
const commentsController = require("../../controllers/web/commentsController");
const validate = require("../../middleware/validate");
const { requireAuth } = require("../../middleware/requireAuth");
const { createPostRules } = require("../../validators/post");
const { createCommentRules } = require("../../validators/comment");

/*
THE TIMELINE — POST ROUTES

Action          Method   Route
-------------------------------------------
List posts      GET      /posts
Show post       GET      /posts/:id
Create post     POST     /posts
Show edit form  GET      /posts/:id/edit
Update post     POST     /posts/:id
Delete post     POST     /posts/:id/delete

GET / redirects to /posts.

Update and delete intentionally use POST
because they are submitted through HTML forms.
*/


// Redirect homepage requests to the posts page.
postsRouter.get("/", (req, res) => {
  res.redirect("/posts");
});

// Display all posts on the Timeline.
postsRouter.get("/posts", postsController.listPostsHandler);

// Create a new post from the Timeline form.
postsRouter.post(
  "/posts",
  requireAuth,
  createPostRules,
  validate((req, res, next, message) => {
    res.locals.validationError = message;
    res.locals.submittedContent =
      typeof req.body?.content === "string" ? req.body.content : "";

    res.status(422);
    return postsController.listPostsHandler(req, res, next);
  }),
  postsController.createPostHandler
);

// Display one post using the ID supplied in the URL.
postsRouter.get("/posts/:id", postsController.showPostHandler);

// Require login before displaying an editing form.
postsRouter.get(
  "/posts/:id/edit",
  requireAuth,
  postsController.editPostHandler
);

// Require login before deleting a post.
postsRouter.post(
  "/posts/:id/delete",
  requireAuth,
  postsController.deletePostHandler
);

// Save the edited post.
postsRouter.post(
  "/posts/:id",
  requireAuth,
  createPostRules,
  validate((req, res, next, message) => {
    res.locals.validationError = message;
    res.locals.submittedContent =
      typeof req.body?.content === "string" ? req.body.content : "";
    res.status(422);
    return postsController.editPostHandler(req, res, next);
  }),
  postsController.updatePostHandler
);


// Create a comment belonging to a specific post.
// KNOWN LIMITATION:
// Comment content is validated before checking whether the post exists.
// If both the post ID and comment content are invalid, the route returns
// HTTP 422 (validation error) instead of HTTP 404 (post not found).
// This is intentional for now; improving the check order is deferred.
postsRouter.post(
  "/posts/:id/comments",
  requireAuth,
  createCommentRules,
  validate((req, res, next, message) => {
    res.locals.commentValidationError = message;
    res.locals.commentPostId = req.params.id;
    res.locals.submittedComment =
      typeof req.body?.content === "string" ? req.body.content : "";

    res.status(422);
    return postsController.listPostsHandler(req, res, next);
  }),
  commentsController.createCommentHandler
);

// Export the postsRouter so server.js can mount it in the Express app.
module.exports = postsRouter;
