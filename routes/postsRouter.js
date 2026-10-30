// Create an Express router to define routes for posts.
const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");


// Send homepage requests to the posts controller.
postsRouter.get("/", postsController.postsHandler);


// Export the postsRouter so server.js can mount it in the Express app.
module.exports = postsRouter;