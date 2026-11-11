const express = require("express");
const authController = require("../../controllers/web/authController");

const router = express.Router();

router.post("/login", authController.login);
// Display the login page.
router.get("/login", authController.showLogin);
// End the current browser login.
router.post("/logout", authController.logout);

module.exports = router;