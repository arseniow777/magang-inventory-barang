import { sendError } from "../utils/response.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "JsonWebTokenError") {
    return sendError(res, "Token tidak valid", 401);
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, "Token sudah kadaluarsa", 401);
  }

  const statusCode = err.statusCode || 500;

  // Never expose raw error messages for unexpected server errors
  const message =
    statusCode === 500
      ? "Internal server error"
      : err.message || "Internal server error";

  return sendError(res, message, statusCode);
};

export default errorHandler;
