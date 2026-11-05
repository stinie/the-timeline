const { body } = require("express-validator");

const createCommentRules = [
  body("content")
    .trim()
    .isLength({ min: 25 })
    .withMessage("Comment must contain at least 25 characters")
];

module.exports = { createCommentRules };