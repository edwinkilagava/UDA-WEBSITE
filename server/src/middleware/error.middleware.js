
export default function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = Number(error.statusCode) || 500;
  let message = error.message || "An unexpected server error occurred.";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "The submitted information is invalid.";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "The submitted resource identifier is invalid.";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "A record with this information already exists.";
  }

  if (statusCode >= 500) {
    console.error("Request failed:", {
      requestId: req.requestId,
      error: error.message,
    });

    message = "An internal server error occurred.";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    requestId: req.requestId,
  });
}
