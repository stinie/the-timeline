const authService = require("../../services/authService");

// Return the safe user profile already loaded by loadUser.
const getCurrentUser = (req, res) => {
  return res.status(200).json({
    user: req.user
  });
};

// Authenticate the user and return a safe profile as JSON.
const login = async (req, res, next) => {
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";

  // Preserve the password exactly as entered.
  const password = typeof req.body?.password === "string"
    ? req.body.password
    : "";

  if (!email || !password) {
    return res.status(422).json({
      error: "Email and password are required"
    });
  }

  try {
    const user = await authService.checkCredentials(email, password);

    if (!user) {
      return res.status(401).json({
        error: "Email or password is incorrect"
      });
    }

    const token = authService.createToken(user._id);

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/"
    });

    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    return next(err);
  }
};

// Clear the authentication cookie and confirm logout as JSON.
const logout = (req, res) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res.status(200).json({
    user: null
  });
};

module.exports = {
  getCurrentUser,
  login,
  logout
};