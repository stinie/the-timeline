// Display the authentication page.
exports.showLogin = (req, res) => {
  res.render("auth/auth", { title: "Login" });
};