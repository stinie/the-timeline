// Import the Post model to retrieve posts from MongoDB.
const Post = require("../models/post");

// Import the User model to look up the default post author.
const User = require("../models/user");

// Import the Comment model to delete comments belonging to a post.
const Comment = require("../models/comment");

// Define success messages in one place for posts and comments.
const successMessages = {
  created: "Post created successfully.",
  updated: "Post updated successfully.",
  deleted: "Post deleted successfully.",
  commented: "Comment added successfully."
};

// Helper function to format a timestamp into a readable date string for the Timeline.
function formatDate(timestamp) {
  const date = new Date(timestamp);

  const day = date.getUTCDate();

  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : { 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th";

  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC"
  });

  const year = date.getUTCFullYear();

  return `${month} ${day}${suffix} ${year}`;
}

// Homepage handler: Retrieve posts, format dates, and render the homepage.
const listPostsHandler = (req, res, next) => {
  Post.find()
    .sort({ createdAt: -1 })
    .populate("userId")
    .populate({
      path: "comments",
      options: { sort: { createdAt: 1 } },
      populate: { path: "userId" }
    })
    .lean()
    // LEARNING TEST: Centralized error handling
    // Uncomment this block after .lean() to simulate a rejected promise.
    // The error skips the next .then() and reaches .catch(next),
    // which forwards it to middleware/errorHandler.js.
    // Comment it out again to restore normal operation.

    // .then(() => {
    //   throw new Error("TEST: centralized error handling");
    // })
    .then((posts) => {
      const formattedPosts = posts.map(post => ({
        ...post,
        formattedDate: formatDate(post.createdAt),
        comments: post.comments.map(comment => ({
          ...comment,
          formattedDate: formatDate(comment.createdAt)
        }))
      }));

      // Render the homepage with posts and a success message derived from the URL query.
      res.render("index", {
        posts: formattedPosts,
        title: "Home",
        postsError: null,
        successMessage:
          typeof req.query.success === "string" &&
            Object.hasOwn(successMessages, req.query.success)
            ? successMessages[req.query.success]
            : null
      });
    })
    .catch(next);
};

// Save a new post using the User configured for development.
const createPostHandler = (req, res, next) => {
  const devUserId = process.env.DEV_USER_ID;
  // TEST ONLY: Simulate an author who does not exist in MongoDB.
  // Restore the original DEV_USER_ID line after testing.
  // const devUserId = "000000000000000000000000";

  // Only post creation needs DEV_USER_ID to identify the development author.
  // Check it before querying MongoDB, and forward configuration errors
  // to the centralized error handler instead of responding here.
  if (!devUserId || !/^[a-fA-F0-9]{24}$/.test(devUserId)) {
    return next(new Error("DEV_USER_ID is missing or invalid."));
  }

  User.findById(devUserId)
    .then((user) => {
      if (!user) {
        throw new Error("The User configured by DEV_USER_ID was not found.");
      }

      const post = new Post({
        content: req.body.content,
        userId: user._id
      });

      return post.save();
    })
    .then(() => {
      res.redirect("/posts?success=created");
    })
    .catch(next);
};

// Retrieve one post by its URL ID and render the full message.
const showPostHandler = (req, res, next) => {
  Post.findById(req.params.id)
    .lean()
    // .then(() => {
    //   throw new Error("TEST: centralized error handling");
    // })
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.status = 404;
        return next(error);
      }

      res.render("show", {
        title: "Show One Post",
        post: {
          ...post,
          formattedDate: formatDate(post.createdAt)
        }
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        err.status = 404;
        return next(err);
      }

      next(err);
    });
};

// Delete a post's comments first, then delete the post.
const deletePostHandler = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.status = 404;
        return next(error);
      }

      return Comment.deleteMany({ postId: post._id })
        .then(() => Post.findByIdAndDelete(post._id))
        .then(() => {
          // Redirect only after both deletion operations succeed.
          res.redirect("/posts?success=deleted");
        });
    })
    .catch(err => {
      if (err.name === "CastError") {
        err.status = 404;
        return next(err);
      }

      next(err);
    });
};

// Retrieve one post and display its edit form.
const editPostHandler = (req, res, next) => {
  Post.findById(req.params.id)
    .lean()
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.status = 404;
        return next(error);
      }

      res.render("edit", {
        title: "Edit Post",
        post: {
          ...post,
          formattedDate: formatDate(post.createdAt)
        }
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        err.status = 404;
        return next(err);
      }

      next(err);
    });
};

// Save the edited content and return to the post.
const updatePostHandler = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.status = 404;
        return next(error);
      }

      post.content = req.body.content;

      return post.save().then(() => {
        res.redirect("/posts?success=updated");
      });

      // TEST: Temporarily replace post.save() with this line to simulate a saving error.
      // Restore post.save() after testing.
      // return Promise.reject(new Error("TEST: saving failed"));

    })
    .catch(err => {
      if (err.name === "CastError") {
        err.status = 404;
        return next(err);
      }

      next(err);
    });
};

module.exports = {
  listPostsHandler,
  createPostHandler,
  showPostHandler,
  deletePostHandler,
  editPostHandler,
  updatePostHandler
};