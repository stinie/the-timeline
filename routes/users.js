const express = require("express");
const router = express.Router();

function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}
router.use(logger);

// Static routes
router.get("/", (req, res) => {
  res.send("User List");
});

router.get("/new", (req, res) => {
  res.render("users/new", {
    firstName: "Test Turtle"
  });
});

router.post("/", (req, res) => {
  const isValid = true;
  if (isValid) {
    users.push({ firstName: req.body.firstName });
    res.redirect(`/users/${users.length - 1}`);
  } else {
    console.log("Error");
    res.render("users/new", {firstName: req.body.firstName}); // populate input field value back to the users
  }
});

// Dynamic parameter

router.get("/:id", (req, res) => {
  res.send(`Get User with ID: ${req.params.id}`);
});

router.put("/:id", (req, res) => {
  res.send(`Update User with ID: ${req.params.id}`);
});

router.delete("/:id", (req, res) => {
  res.send(`Delete User with ID: ${req.params.id}`);
});

const users = [{name: "Stinie"},{name: "Sue"}];
router.param("id", (req, res, next, id) => {
  req.user = users[id];
  next();
});


module.exports = router;