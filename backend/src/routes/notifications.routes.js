import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
  deleteNotification,
  contactAdminFromWeb,
} from "../controllers/notifications.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/contact-admin/web", contactAdminFromWeb);
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.delete("/:id", checkRole("admin"), deleteNotification);

export default router;
