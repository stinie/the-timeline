const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  // Make the guest state available to controllers and EJS templates.
  req.user = null;
  res.locals.currentUser = null;

  const token = req.cookies.userToken;

  // Guests can continue without a token.
  if (!token) {
    return next();
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new Error("JWT_SECRET is not configured"));
  }

  let payload;

  try {
    // Verify the signature and expiry before trusting the user ID.
    payload = jwt.verify(token, secret, {
      algorithms: ["HS256"]
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // Remove invalid or expired authentication cookies.
      res.clearCookie("userToken", { path: "/" });
      return next();
    }

    return next(err);
  }

  // Accept only tokens containing a valid MongoDB user ID.
  if (
    typeof payload.sub !== "string" ||
    !/^[a-fA-F0-9]{24}$/.test(payload.sub)
  ) {
    res.clearCookie("userToken", { path: "/" });
    return next();
  }

  try {
    // Load only the profile fields needed by the application.
    const user = await User.findById(payload.sub)
      .select("_id username firstName lastName")
      .lean();

    if (!user) {
      res.clearCookie("userToken", { path: "/" });
      return next();
    }

    // Share the verified user with controllers and EJS templates.
    req.user = user;
    res.locals.currentUser = user;

    return next();
  } catch (err) {
    // Forward database failures to the existing error handler.
    return next(err);
  }
};