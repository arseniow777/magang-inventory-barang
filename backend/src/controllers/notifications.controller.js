import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' }
    });
    return sendSuccess(res, "Data notifications berhasil diambil", notifications);
  } catch (err) {
    next(err);
  }
};

export const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notifications.findUnique({
      where: { id: parseInt(id) }
    });

    if (!notification) {
      return sendError(res, "Notification tidak ditemukan", 404);
    }

    if (notification.user_id !== req.user.id) {
      return sendError(res, "Anda tidak memiliki akses ke notification ini", 403);
    }

    return sendSuccess(res, "Data notification berhasil diambil", notification);
  } catch (err) {
    next(err);
  }
};



export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notifications.findUnique({
      where: { id: parseInt(id) }
    });

    if (!notification) {
      return sendError(res, "Notification tidak ditemukan", 404);
    }

    if (notification.user_id !== req.user.id) {
      return sendError(res, "Anda tidak memiliki akses ke notification ini", 403);
    }

    await prisma.notifications.delete({
      where: { id: parseInt(id) }
    });

    return sendSuccess(res, "Notification berhasil dihapus");
  } catch (err) {
    next(err);
  }
};