import { Router } from "express";
import { getLocations, getLocationById, createLocation, updateLocation, deleteLocation } from "../controllers/locations.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyToken, checkRole("admin"));

router.get("/", getLocations);
router.get("/:id", getLocationById);
router.post("/", createLocation);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;