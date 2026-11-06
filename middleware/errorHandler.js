const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const safeStatus = status >= 400 && status < 600 ? status : 500;

  if (safeStatus === 404) {
    return res.status(404).render("404", {
      title: "Page not found"
    });
  }

  if (safeStatus >= 500) {
    console.error("Application error:", err);
  }

  res.status(safeStatus).render("error", {
    title: safeStatus === 500 ? "Server Error" : "Request Error"
  });
};

module.exports = errorHandler;