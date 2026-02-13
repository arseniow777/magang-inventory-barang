import { Router } from "express";
import {
  getReports,
  getReportById,
  getReportByRequestId,
  downloadReport,
} from "../controllers/reports.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", getReports);
router.get("/:id", getReportById);
router.get("/request/:request_id", getReportByRequestId);
router.get("/:id/download", downloadReport);

export default router;