const express = require("express");
const router = express.Router();

function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}

router.use(logger);

// Static routes
router.get("/", (reg, res) => {
  res.send("User List");
});

router.get("/new", (reg, res) => {
  res.send("User New Form");
});

router.post("/", (reg, res) => {
  res.send("Create User");
});

// Dynamic parameter

router.get("/:id", (reg, res) => {
  res.send(`Get User with ID: ${reg.params.id}`);
});

router.put("/:id", (reg, res) => {
  res.send(`Update User with ID: ${reg.params.id}`);
});

router.delete("/:id", (reg, res) => {
  res.send(`Delete User with ID: ${reg.params.id}`);
});

const users = [{name: "Stinie"},{name: "Sue"}];
router.param("id", (reg, res, next, id) => {
  reg.user = users[id];
  next();
});


module.exports = router;