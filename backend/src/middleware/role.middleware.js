import { sendError } from "../utils/response.js";

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, "Akses ditolak, role tidak sesuai", 403);
    }
    next();
  };
};