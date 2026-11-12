const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Return the user when the email and password match.
exports.checkCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  // Existing users without a password cannot log in yet.
  if (!user || !user.password) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  return passwordMatches ? user : null;
};

// Create a signed token identifying the authenticated user.
exports.createToken = (userId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {},
    secret,
    {
      algorithm: "HS256",
      subject: userId.toString(),
      expiresIn: "1h"
    }
  );
};

// Hash the password and save only the intended account fields.
exports.registerUser = async ({
  username,
  firstName,
  lastName,
  email,
  password
}) => {
  const passwordHash = await bcrypt.hash(password, 10);

  return User.create({
    username,
    firstName,
    lastName,
    email,
    password: passwordHash
  });
};