const express = require("express");
const apiRouter = express.Router();
const postsController = require("../controllers/api/postsController");

// server.js adds the /api prefix, so this becomes GET /api/posts.
apiRouter.get("/posts", postsController.getAllPosts);

// Express makes the URL's :id value available as req.params.id.
apiRouter.get("/posts/:id", postsController.getOnePost);

module.exports = apiRouter;