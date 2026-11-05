// module.exports = validate;

const { validationResult } = require("express-validator");
const { listPostsHandler } = require("../controllers/postsController");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  res.locals.validationError = errors.array()[0].msg;
  res.locals.submittedContent = req.body.content || "";

  res.status(422);
  return listPostsHandler(req, res);
};

module.exports = validate;