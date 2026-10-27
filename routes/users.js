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
  console.log(req.body.firstName); // put before res.send
  res.send("Create User");
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