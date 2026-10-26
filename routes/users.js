const express = require("express");
const router = express.Router();

router.get("/", (reg, res) => {
  res.send("User list");
});

router.get("/new", (reg, res) => {
  res.send("User New Form");
});

module.exports = router;