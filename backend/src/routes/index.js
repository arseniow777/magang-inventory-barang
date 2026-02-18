import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import locationsRoutes from "./locations.routes.js";
import itemsRoutes from "./items.routes.js";
import itemUnitsRoutes from "./itemUnits.routes.js";
import auditLogsRoutes from './auditLogs.routes.js';
import requestsRoutes from "./requests.routes.js";
import reportsRoutes from "./reports.routes.js";
import passwordResetsRoutes from './passwordResets.routes.js';
import notificationsRoutes from './notifications.routes.js';
import botRoutes from './bot.routes.js';
import '../utils/telegramBot.js';

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes );
router.use("/locations", locationsRoutes );
router.use("/items", itemsRoutes );
router.use("/item-units", itemUnitsRoutes);
router.use('/audit-logs', auditLogsRoutes);
router.use("/requests", requestsRoutes);
router.use("/reports", reportsRoutes);
router.use("/password-resets", passwordResetsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/bot", botRoutes);

export default router;