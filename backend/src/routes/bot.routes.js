import { Router } from "express";
import {
  getUserByTelegram,
  getLatestRequestByTelegram,
  getLatestReportByTelegram,
  contactAdmin,
} from "../controllers/bot.controller.js";

const router = Router();

router.get("/user/:telegram_id", getUserByTelegram);
router.get("/requests/:telegram_id", getLatestRequestByTelegram);
router.get("/reports/:telegram_id", getLatestReportByTelegram);
router.post("/contact-admin", contactAdmin);

export default router;