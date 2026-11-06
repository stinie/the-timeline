// Validate post length here before the controller runs.
// No need to repeat this check in postsController.js.

const { body } = require("express-validator");

// Validate post content before saving it.
// isString() requires text instead of an array or object.
// bail() stops validation if the content is not a string.
// trim() removes whitespace from the beginning and end.
// isLength() requires at least 25 characters after trimming.
const createPostRules = [
  body("content")
    .isString()
    .withMessage("Post content must be text")
    .bail()
    .trim()
    .isLength({ min: 25 })
    .withMessage("Post must contain at least 25 characters")
];


module.exports = { createPostRules };