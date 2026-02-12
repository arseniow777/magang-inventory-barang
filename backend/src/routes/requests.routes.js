import { Router } from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  getMyRequests,
  getMyRequestById,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  returnRequest,
  cancelRequest,
} from "../controllers/requests.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/my-requests", getMyRequests);
router.get("/my-requests/:id", getMyRequestById);
router.get("/pending", checkRole("admin"), getPendingRequests);
router.get("/:id", getRequestById);
router.put("/:id/approve", checkRole("admin"), approveRequest);
router.put("/:id/reject", checkRole("admin"), rejectRequest);
router.put("/:id/return", returnRequest);
router.put("/:id/cancel", cancelRequest);

export default router;