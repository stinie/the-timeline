const errorHandler = (err, req, res, next) => {
  console.error("Application error:", err);

  res.status(500).render("index", {
    posts: [],
    title: "Home",
    postsError: "Posts are temporarily unavailable. Please try again later.",
    deleted: false
  });
};

module.exports = errorHandler;