// Import Mongoose to define the post schema and model.
const mongoose = require("mongoose");

// Access Mongoose's Schema constructor.
const Schema = mongoose.Schema;

// Define the fields and validation rules for Timeline posts.
const postSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  authorName: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 25
  }
}, { timestamps: true });

// Create the Post model, which uses the posts collection.
const Post = mongoose.model("Post", postSchema);

// Export the model for use in the posts controller.
module.exports = Post;