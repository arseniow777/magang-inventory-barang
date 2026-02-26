import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Also accept token as query param (used for direct browser PDF navigation)
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : (req.query.token ?? null);

  if (!token) {
    return sendError(res, "Akses ditolak, token tidak ditemukan", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};
