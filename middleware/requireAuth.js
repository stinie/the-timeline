// Require a verified user before continuing to a website action.
exports.requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect(303, "/login");
  }

  return next();
};

// Return JSON when an API action requires authentication.
exports.requireApiAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Login is required"
    });
  }

  return next();
};