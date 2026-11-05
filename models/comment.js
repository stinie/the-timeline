// Import Mongoose to define the comment schema and model.
const mongoose = require("mongoose");

// Access Mongoose's Schema constructor.
const Schema = mongoose.Schema;

const commentSchema = Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 25,
    maxlength: 1000
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
  }
}, { timestamps: true });

// Create the Comment model, which uses the comments collection.
module.exports = mongoose.model("Comment", commentSchema);