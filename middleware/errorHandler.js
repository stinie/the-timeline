const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  if (status === 404) {
    return res.status(404).render("404", {
      title: "Page not found"
    });
  }

  console.error("Application error:", err);

  res.status(500).render("error", {
    title: "Server Error"
  });
};

module.exports = errorHandler;