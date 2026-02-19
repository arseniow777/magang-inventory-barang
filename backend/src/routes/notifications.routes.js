import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
  deleteNotification,
} from "../controllers/notifications.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.delete("/:id", deleteNotification);

export default router;