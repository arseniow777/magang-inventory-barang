// src/routes/auditLogs.routes.js
import { Router } from "express";
import {
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByEntity,
  getAuditLogsByActor,
  exportAuditLogs
} from "../controllers/auditLogs.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyToken);
router.use(checkRole("admin"));

router.get("/", getAuditLogs);
router.get("/export", exportAuditLogs);
router.get("/:id", getAuditLogById);
router.get("/entity/:entity_type/:entity_id", getAuditLogsByEntity);
router.get("/actor/:user_id", getAuditLogsByActor);

export default router;