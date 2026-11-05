const { body } = require("express-validator");

const createPostRules = [
  body("content")
    .trim()
    .isLength({ min: 25 })
    .withMessage("Post must contain at least 25 characters")
];


module.exports = { createPostRules };