import { Router } from "express";
import {
  login,
  getMe,
  logout,
  forgotPassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

router.post("/forgot-password", forgotPassword);

// Brute-force protection: max 10 login attempts per 15 minutes per IP
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit.",
//   },
// });

router.post("/login", login); //kasih loginLimiter di sini untuk mengaktifkan rate limiting pada endpoint
router.get("/me", verifyToken, getMe);
router.post("/logout", verifyToken, logout);

export default router;
