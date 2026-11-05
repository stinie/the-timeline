// Import Mongoose to define the post schema and model.
const mongoose = require("mongoose");

// Access Mongoose's Schema constructor.
const Schema = mongoose.Schema;

// Define the fields and validation rules for Timeline posts.
const postSchema = new Schema({
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
  }
}, {
  timestamps: true,
  // Kept for awareness and future use:
  // Enable these options if the Comment schema gets virtuals
  // that should appear when converting Mongoose documents.
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true }
});

// Define the virtual relationship.
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  justOne: false
});

// Create the Post model, which uses the posts collection.
const Post = mongoose.model("Post", postSchema);

// Export the model for use in the posts controller.
module.exports = Post;