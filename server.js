// Load Express so this file can create and configure the web server.
const express = require("express");

// Load Morgan, the HTTP request-logging middleware.
const morgan = require("morgan");

// Load the posts router.
const postsRouter = require("./routes/postsRouter");

// Create the Express app that handles requests and responses.
const app = express();

// Configure EJS as the template engine for rendering views.
app.set("view engine", "ejs");

// Parse form data from incoming requests and make the submitted values available in req.body.
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON body parsing middleware
app.use(morgan("dev")); // Log each incoming request in Morgan's concise "dev" format.

// Let the posts router handle the home page.
app.use("/", postsRouter);

// Serve files from public, such as public/style.css at /style.css.
app.use(express.static("public"));

// Send requests starting with /users to the users router.
// For example, /users/new is handled by that router.
// const userRouter = require("./routes/users");
// app.use("/users", userRouter);


app.listen(3000); // http://localhost:3000
