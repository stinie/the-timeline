const express = require("express");
const authController = require("../../controllers/web/authController");
const { signupRules } = require("../../validators/auth");
const validate = require("../../middleware/validate");

const router = express.Router();

router.post("/login", authController.login);
// Display the login page.
router.get("/login", authController.showLogin);
// End the current browser login.
router.post("/logout", authController.logout);

// Validate signup details before continuing to registration.
router.post(
  "/signup",
  signupRules,
  validate((req, res, next, message) => {
    return res.status(422).render("auth/auth", {
      title: "Login and signup",
      error: null,
      success: null,
      submittedEmail: "",
      signupError: message,
      signupSuccess: null,
      signupValues: {
        username: typeof req.body.username === "string"
          ? req.body.username : "",
        firstName: typeof req.body.firstName === "string"
          ? req.body.firstName : "",
        lastName: typeof req.body.lastName === "string"
          ? req.body.lastName : "",
        email: typeof req.body.email === "string"
          ? req.body.email : ""
      }
    });
  }),
  authController.signup
);

module.exports = router;