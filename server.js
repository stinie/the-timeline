// Load local environment variables from .env.
process.loadEnvFile();

// Load Express so this file can create and configure the web server.
const express = require("express");

// Load Morgan, the HTTP request-logging middleware.
const morgan = require("morgan");

// Create the Express app that handles requests and responses.
const app = express();

// Use the environment port, or default to 3000 if not set.
const PORT = process.env.PORT || 3000;

// Load the database connection function from config/database.js.
const connectDB = require("./config/database");

// Load the posts router.
const postsRouter = require("./routes/postsRouter");

// Load the error handler middleware.
const errorHandler = require("./middleware/errorHandler");

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


// Render the 404 page for requests not handled by earlier routes or static files.
app.use((req, res) => {
  res.status(404).render("404", { title: "Page not found" });
});

// Handle errors forwarded from routes and middleware.
app.use(errorHandler);

// Connect to the-timeline, then start the server on port 3000.
connectDB()
  .then(() => app.listen(PORT))
  .catch((err) => console.log(err));