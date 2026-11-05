// Import Mongoose to define the post schema and model.
const mongoose = require("mongoose");

// Access Mongoose's Schema constructor.
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: [true, 'User is required'], unique: true },
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/\S+@\S+\.\S+/, "is invalid"] },
}, { timestamps: true });

// Create the User model, which uses the users collection.
module.exports = mongoose.model("User", userSchema);