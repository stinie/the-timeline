// If validation passes, continue to the controller.
// Otherwise, pass the error message to the route's error handler.

const { validationResult } = require("express-validator");

const validate = (onValidationError) => (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return onValidationError(req, res, next, errors.array()[0].msg);
};

module.exports = validate;