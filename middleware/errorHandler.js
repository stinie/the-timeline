const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const safeStatus = status >= 400 && status < 600 ? status : 500;

  // API requests need JSON errors instead of an EJS error page.
  if (req.path === "/api" || req.path.startsWith("/api/")) {
    if (safeStatus >= 500) {
      // Keep the technical details in the server console.
      console.error("Application error:", err);
    }

    return res.status(safeStatus).json({
      error:
        safeStatus >= 500
          ? "An unexpected server error occurred."
          : err.message
    });
  }

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