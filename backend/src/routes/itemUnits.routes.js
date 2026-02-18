import { Router } from "express";
import {
  getItemUnits,
  getItemUnitById,
  getItemUnitByCode,
  updateItemUnit,
} from "../controllers/itemUnits.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();


router.get("/", checkRole("admin"), getItemUnits);
router.get("/code/:unit_code", getItemUnitByCode);
router.get("/:id", checkRole("admin"), getItemUnitById);

router.use(verifyToken);

router.put("/:id", checkRole("admin"), updateItemUnit);

export default router;