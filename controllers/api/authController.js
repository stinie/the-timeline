// Return the safe user profile already loaded by loadUser.
const getCurrentUser = (req, res) => {
  return res.status(200).json({
    user: req.user
  });
};

module.exports = {
  getCurrentUser
};