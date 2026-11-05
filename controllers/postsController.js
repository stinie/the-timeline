// Import the Post model to retrieve posts from MongoDB.
const Post = require("../models/post");

// Import the User model to look up the default post author.
const User = require("../models/user");

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

      // Render the homepage with posts and a deletion success flag derived from the URL query.
      res.render("index", {
        posts: formattedPosts,
        title: "Home",
        postsError: null,
        deleted: req.query.deleted === "1"
      });
    })
    .catch(next);
};

// Save a new post using the User configured for development.
const createPostHandler = (req, res, next) => {
  const devUserId = process.env.DEV_USER_ID;

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
      res.redirect("/posts");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send(
          "Please enter a message of at least 25 characters."
        );
      }

      next(err);
    });
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
        return res.status(404).render("404", {
          title: "Post not found"
        });
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
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }

      next(err);
    });
};

// Delete a post by its ID, then return to the homepage.
const deletePostHandler = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }
      // Redirect after deletion to avoid resubmitting the POST on refresh.
      // The query parameter ?deleted=1 tells the homepage to show a success message.
      res.redirect("/posts?deleted=1");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).render("404", {
          title: "Post not found"
        });
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
        return res.status(404).render("404", {
          title: "Post not found"
        });
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
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }

      next(err);
    });
};

// Save the edited content and return to the post.
const updatePostHandler = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }

      post.content = req.body.content;

      return post.save().then(() => {
        res.redirect("/");
      });
    })
    .catch(err => {
      if (err.name === "CastError") {
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }

      if (err.name === "ValidationError") {
        return res.status(400).send("Could not update the post.");
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