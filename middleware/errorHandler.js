const errorHandler = (err, req, res, next) => {
  console.error("Application error:", err);

  res.status(500).render("error", {
    title: "Server Error"
  });
};

module.exports = errorHandler;