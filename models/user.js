// Import Mongoose to define the post schema and model.
const mongoose = require("mongoose");

// Access Mongoose's Schema constructor.
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

// Create the User model, which uses the users collection.
module.exports = mongoose.model("User", userSchema);