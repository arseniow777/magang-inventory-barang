import { Router } from "express";
import {
  getReports,
  getReportById,
  getReportByRequestId,
  approveReport,
  rejectReport,
  downloadReport,
} from "../controllers/reports.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", getReports);
router.get("/:id", getReportById);
router.get("/request/:request_id", getReportByRequestId);
router.get("/:id/download", downloadReport);
router.put("/:id/approve", checkRole("admin"), approveReport);
router.put("/:id/reject", checkRole("admin"), rejectReport);

export default router;