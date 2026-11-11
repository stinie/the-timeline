// Load local environment variables from .env.
process.loadEnvFile();

// Load Express so this file can create and configure the web server.
const express = require("express");

// Load Morgan, the HTTP request-logging middleware.
const morgan = require("morgan");

// Read cookies sent by the browser.
const cookieParser = require("cookie-parser");

// Create the Express app that handles requests and responses.
const app = express();

// Use the environment port, or default to 3000 if not set.
const PORT = process.env.PORT || 3000;

// Load the database connection function from config/database.js.
const connectDB = require("./config/database");

// Load the auth router.
const authRouter = require("./routes/web/authRouter");

// Load the posts router.
const postsRouter = require("./routes/web/postsRouter");

// Load the api router.
const apiRouter = require("./routes/api/postsRouter");

// Load the error handler middleware.
const errorHandler = require("./middleware/errorHandler");

// Recognize the user identified by a verified authentication token.
const loadUser = require("./middleware/loadUser");

// Configure EJS as the template engine for rendering views.
app.set("view engine", "ejs");

// Parse form data from incoming requests and make the submitted values available in req.body.
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON body parsing middleware
app.use(morgan("dev")); // Log each incoming request in Morgan's concise "dev" format.

// Serve files from public, such as public/style.css at /style.css.
app.use(express.static("public"));

// Parse cookies before checking for an authenticated user.
app.use(cookieParser());
app.use(loadUser);

// Handle application routes after establishing the current user.
app.use("/api", apiRouter);
app.use("/", authRouter);
app.use("/", postsRouter);


// Render the 404 page for requests not handled by earlier routes or static files.
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "Page not found" });
});

// Handle errors forwarded from routes and middleware.
app.use(errorHandler);

// Connect to the-timeline, then start the server on port 3000.
connectDB()
  .then(() => app.listen(PORT))
  .catch((err) => console.log(err));
