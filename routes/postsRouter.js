// Create an Express router to define routes for posts.
const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");
const commentsController = require("../controllers/commentsController");
const validate = require("../middleware/validate");
const { createPostRules } = require("../validators/post");
const { createCommentRules } = require("../validators/comment");

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
  createPostRules,
  validate((req, res, next, message) => {
    res.locals.validationError = message;
    res.locals.submittedContent = req.body.content || "";

    res.status(422);
    return postsController.listPostsHandler(req, res, next);
  }),
  postsController.createPostHandler
);

// Display one post using the ID supplied in the URL.
postsRouter.get("/posts/:id", postsController.showPostHandler);

// Display the edit form for one post.
postsRouter.get("/posts/:id/edit", postsController.editPostHandler);

// Delete one post using the ID supplied in the URL.
postsRouter.post("/posts/:id/delete", postsController.deletePostHandler);

// Save the edited post.
postsRouter.post(
  "/posts/:id",
  createPostRules,
  validate((req, res, next, message) => {
    res.locals.validationError = message;
    res.locals.submittedContent = req.body.content ?? "";
    res.status(422);
    return postsController.editPostHandler(req, res, next);
  }),
  postsController.updatePostHandler
);

// Create a comment belonging to a specific post.
postsRouter.post(
  "/posts/:id/comments",
  createCommentRules,
  validate((req, res, next, message) => {
    res.locals.commentValidationError = message;
    res.locals.commentPostId = req.params.id;
    res.locals.submittedComment = req.body.content || "";

    res.status(422);
    return postsController.listPostsHandler(req, res, next);
  }),
  commentsController.createCommentHandler
);

// Export the postsRouter so server.js can mount it in the Express app.
module.exports = postsRouter;