// Validate comment length here before the controller runs.
// No need to repeat this check in commentsController.js.

const { body } = require("express-validator");

// Validate comment content before the controller runs.
// isString() requires text instead of an array or object.
// bail() stops validation if the content is not a string.
// trim() removes whitespace from the beginning and end.
// isLength() requires at least 25 characters after trimming.
// No need to repeat these checks in commentsController.js.
const createCommentRules = [
  body("content")
    .isString()
    .withMessage("Comment content must be text")
    .bail()
    .trim()
    .isLength({ min: 25 })
    .withMessage("Comment must contain at least 25 characters")
];

module.exports = { createCommentRules };