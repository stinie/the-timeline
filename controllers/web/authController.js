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

// Testing
// Confirm valid signup input; saving the user comes next.
// exports.signup = (req, res) => {
//   return res.render("auth/auth", {
//     title: "Login and signup",
//     error: null,
//     success: null,
//     submittedEmail: "",
//     signupError: null,
//     signupSuccess: "Signup details validated. Account creation comes next.",
//     signupValues: {
//       username: req.body.username,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email
//     }
//   });
// };

// Create an account after the signup rules have passed.
exports.signup = async (req, res, next) => {
  const { username, firstName, lastName, email, password } = req.body;

  // Preserve non-password details if registration fails.
  const signupValues = {
    username,
    firstName,
    lastName,
    email
  };

  try {
    await authService.registerUser({
      username,
      firstName,
      lastName,
      email,
      password
    });

    return res.status(201).render("auth/auth", {
      title: "Login and signup",
      error: null,
      success: "Account created. You can log in now.",
      submittedEmail: email,
      signupError: null,
      signupSuccess: null,
      signupValues: {}
    });
  } catch (err) {
    // MongoDB rejects duplicate values in unique indexes.
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || err.keyValue || {})[0];

      const message =
        field === "username"
          ? "That username is already taken"
          : field === "email"
            ? "That email is already registered"
            : "An account with those details already exists";

      return res.status(409).render("auth/auth", {
        title: "Login and signup",
        error: null,
        success: null,
        submittedEmail: "",
        signupError: message,
        signupSuccess: null,
        signupValues
      });
    }

    // Display model validation errors without exposing database details.
    if (err.name === "ValidationError") {
      return res.status(422).render("auth/auth", {
        title: "Login and signup",
        error: null,
        success: null,
        submittedEmail: "",
        signupError: "Please check your signup details",
        signupSuccess: null,
        signupValues
      });
    }

    return next(err);
  }
};