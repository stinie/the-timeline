// Load Express so this file can create and configure the web server.
const express = require("express");

// Load Morgan, the HTTP request-logging middleware.
const morgan = require("morgan");

// Load the posts from the project's JSON data file.
const posts = require("./data/posts.json");

// Create the Express app that handles requests and responses.
const app = express();

// Handle / first, rendering views/index.ejs.
app.set("view engine", "ejs");

// Parse form data from incoming requests and make the submitted values available in req.body.
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON body parsing middleware
app.use(morgan("dev")); // Log each incoming request in Morgan's concise "dev" format.

// Render the EJS home page with the posts when the browser requests /.
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// Serve files from public, such as public/style.css at /style.css.
app.use(express.static("public"));

// Send requests starting with /users to the users router.
// For example, /users/new is handled by that router.
// const userRouter = require("./routes/users");
// app.use("/users", userRouter);


app.listen(300); // http://localhost:300