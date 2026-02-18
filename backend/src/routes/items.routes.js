import { Router } from "express";
import {
  createItem,
  restockItem,
  getItems,
  getItemById,
  updateItem,
  addItemPhoto,
  deleteItemPhoto,
} from "../controllers/items.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { uploadItemPhotos } from "../utils/upload.js";

const router = Router();


router.get("/", getItems);
router.get("/:id", getItemById);

router.use(verifyToken);

router.post("/", checkRole("admin"), uploadItemPhotos, createItem);
router.post("/:id/restock", checkRole("admin"), restockItem);
router.put("/:id", checkRole("admin"), updateItem);
router.post("/:id/photos", checkRole("admin"), uploadItemPhotos, addItemPhoto);
router.delete("/:id/photos/:photoId", checkRole("admin"), deleteItemPhoto);

export default router;