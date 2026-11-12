const { body } = require("express-validator");

const signupRules = [
  body("username")
    .isString().withMessage("Username must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Username is required"),

  body("firstName")
    .isString().withMessage("First name must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("First name is required"),

  body("lastName")
    .isString().withMessage("Last name must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Last name is required"),

  body("email")
    .isString().withMessage("Email must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Email is invalid")
    .bail()
    .toLowerCase(),

  // Preserve passwords exactly as entered; do not trim them.
  body("password")
    .isString().withMessage("Password must be text")
    .bail()
    .notEmpty().withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 bytes"),
    

  // Check confirmation without storing it in the user document.
  body("confirmPassword")
    .isString().withMessage("Password confirmation must be text")
    .bail()
    .notEmpty().withMessage("Please confirm your password")
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match")
];

module.exports = {
  signupRules
};