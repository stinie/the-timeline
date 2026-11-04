// Import the Post model to retrieve posts from MongoDB.
const Post = require("../models/post");

// Import the User model to look up the default post author.
const User = require("../models/user");

// Format a post timestamp into a readable Timeline date.
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
const postsHandler = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .populate("userId")
    .lean()
    .then((posts) => {
      const formattedPosts = posts.map(post => ({
        ...post,
        formattedDate: formatDate(post.createdAt)
      }));
      
      // Render the homepage with posts and a deletion success flag derived from the URL query.
      res.render("index", {
        posts: formattedPosts,
        title: "Home",
        postsError: null,
        deleted: req.query.deleted === "1"
      });

    })
    .catch((err) => {
      console.error("Could not retrieve posts:", err);

      res.status(500).render("index", {
        posts: [],
        title: "Home",
        postsError: "Posts are temporarily unavailable. Please try again later.",
        deleted: false
      });
    });
};

// Save a new post using the User configured for development.
const createPostHandler = (req, res) => {
  const devUserId = process.env.DEV_USER_ID;

  // Require a valid ObjectId before querying MongoDB.
  if (!devUserId || !/^[a-fA-F0-9]{24}$/.test(devUserId)) {
    console.error("DEV_USER_ID is missing or invalid.");
    return res.status(500).send(
      "Your post could not be saved. Please try again later."
    );
  }

  User.findById(devUserId)
    .then((user) => {
      if (!user) {
        throw new Error("The User configured by DEV_USER_ID was not found.");
      }

      const post = new Post({
        content: req.body.content,
        userId: user._id,
        username: user.username,
        authorName: `${user.firstName} ${user.lastName}`
      });

      return post.save();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Could not create post:", err);

      const status = err.name === "ValidationError" ? 400 : 500;
      res.status(status).send(
        status === 400
          ? "Please enter a message of at least 25 characters."
          : "Your post could not be saved. Please try again later."
      );
    });
};

// Retrieve one post by its URL ID and render the full message.
const showPostHandler = (req, res) => {
  Post.findById(req.params.id)
    .lean()
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

      console.error("Could not retrieve post:", err);
      // Display the retrieval error within the shared Timeline layout.
      res.status(500).render("index", {
        posts: [],
        title: "Post unavailable",
        postsError: "This post is temporarily unavailable. Please try again later.",
        deleted: false
      });
    });
};

// Delete a post by its ID, then return to the homepage.
const deletePostHandler = (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }
      // Return to the homepage with a deletion success indicator.
      res.redirect("/?deleted=1");
    })
    .catch(err => {
      if (err.name === "CastError") {
        return res.status(404).render("404", {
          title: "Post not found"
        });
      }

      console.error("Could not delete post:", err);

      res.status(500).render("index", {
        posts: [],
        title: "Delete unsuccessful",
        postsError: "This post could not be deleted. Please try again later.",
        deleted: false
      });
    });
};

// Retrieve one post and display its edit form.
const editPostHandler = (req, res) => {
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
    .catch(err => {
      console.error("Could not load edit form:", err);
      res.status(err.name === "CastError" ? 404 : 500)
        .send("Could not load the post.");
    });
};

// Save the edited content and return to the post.
const updatePostHandler = (req, res) => {
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
      console.error("Could not update post:", err);
      res.status(err.name === "CastError" ? 404 :
        err.name === "ValidationError" ? 400 : 500)
        .send("Could not update the post.");
    });
};

module.exports = {
  postsHandler,
  createPostHandler,
  showPostHandler,
  deletePostHandler,
  editPostHandler,
  updatePostHandler
};