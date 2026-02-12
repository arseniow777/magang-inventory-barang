import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import locationsRoutes from "./locations.routes.js";
import itemsRoutes from "./items.routes.js";
import itemUnitsRoutes from "./itemUnits.routes.js";
import auditLogsRoutes from './auditLogs.routes.js';
import requestsRoutes from "./requests.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes );
router.use("/locations", locationsRoutes );
router.use("/items", itemsRoutes );
router.use("/item-units", itemUnitsRoutes);
router.use('/audit-logs', auditLogsRoutes);
router.use("/requests", requestsRoutes);

export default router;