const express = require("express");
const authController = require("../../controllers/web/authController");

const router = express.Router();

// Display the login page.
router.get("/login", authController.showLogin);

module.exports = router;