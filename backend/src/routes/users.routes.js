import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, generateTelegramLink, disconnectTelegram } from "../controllers/users.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyToken);
router.post("/telegram/generate-link", generateTelegramLink);
router.post("/telegram/disconnect", disconnectTelegram);

router.use(checkRole("admin"));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;