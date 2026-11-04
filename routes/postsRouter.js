// Create an Express router to define routes for posts.
const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");


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
postsRouter.post("/posts", postsController.createPostHandler);

// Display one post using the ID supplied in the URL.
postsRouter.get("/posts/:id", postsController.showPostHandler);

// Display the edit form for one post.
postsRouter.get("/posts/:id/edit", postsController.editPostHandler);

// Delete one post using the ID supplied in the URL.
postsRouter.post("/posts/:id/delete", postsController.deletePostHandler);

// Save the edited post.
postsRouter.post("/posts/:id", postsController.updatePostHandler);

// Export the postsRouter so server.js can mount it in the Express app.
module.exports = postsRouter;