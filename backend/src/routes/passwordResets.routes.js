// src/routes/passwordResets.routes.js
import { Router } from "express";
import {
  getPasswordResets,
  approvePasswordReset,
  rejectPasswordReset
} from "../controllers/passwordResets.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyToken);
router.use(checkRole("admin"));

router.get("/", getPasswordResets);
router.put("/:id/approve", approvePasswordReset);
router.put("/:id/reject", rejectPasswordReset);

export default router;