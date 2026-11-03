// Create an Express router to define routes for posts.
const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");


// Send homepage requests to the posts controller.
postsRouter.get("/", postsController.postsHandler);

// Handle messages submitted from the Timeline form.
postsRouter.post("/", postsController.createPostHandler);

// Display one post using the ID supplied in the URL.
postsRouter.get("/show/:id", postsController.showPostHandler);

// Send delete requests to the posts controller.
postsRouter.post("/delete/:id", postsController.deletePostHandler);

// Display the edit form for one post.
postsRouter.get("/edit/:id", postsController.editPostHandler);

// Save the edited post.
postsRouter.post("/edit/:id", postsController.updatePostHandler);

// Export the postsRouter so server.js can mount it in the Express app.
module.exports = postsRouter;