const authService = require("../../services/authService");

// Display the authentication page.
exports.showLogin = (req, res) => {
  res.render("auth/auth", {
    title: "Login",
    error: null,
    success: null,
    submittedEmail: ""
  });
};

// Check the submitted login details.
exports.login = async (req, res, next) => {
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";

  // Preserve the password exactly as entered.
  const password = typeof req.body?.password === "string"
    ? req.body.password
    : "";

  if (!email || !password) {
    return res.status(422).render("auth/auth", {
      title: "Login",
      error: "Email and password are required",
      success: null,
      submittedEmail: email
    });
  }

  try {
    const user = await authService.checkCredentials(email, password);

    if (!user) {
      return res.status(401).render("auth/auth", {
        title: "Login",
        error: "Email or password is incorrect",
        success: null,
        submittedEmail: email
      });
    }

    // Create a token after the password has been verified.
    const token = authService.createToken(user._id);

    // Send the token to the browser as a cookie.
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/"
    });

    return res.redirect(303, "/");
  } catch (err) {
    next(err);
  }
};

// Remove the browser's authentication cookie and return to login.
exports.logout = (req, res) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res.redirect(303, "/login");
};

// Display the authentication page.
exports.showLogin = (req, res) => {
  res.render("auth/auth", {
    title: "Login",
    error: null,
    success: null,
    submittedEmail: ""
  });
};