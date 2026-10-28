// Load Express so this file can create and configure the web server.
const express = require("express");
// Create the Express app that handles requests and responses.
const app = express();

// Handle / first, rendering views/index.ejs.
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON body parsing middleware

// Render the EJS home page when the browser requests the root URL (/).
app.get("/", (req, res) => {
  res.render("index");
});

// Serve files from public, such as public/style.css at /style.css.
app.use(express.static("public"));

// Send requests starting with /users to the users router.
// For example, /users/new is handled by that router.
// const userRouter = require("./routes/users");
// app.use("/users", userRouter);


app.listen(300); // http://localhost:300