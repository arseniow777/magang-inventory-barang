import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getNotifications = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = { user_id: req.user.id };
    if (status) where.status = status;

    const notifications = await prisma.notifications.findMany({
      where,
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

export const markAsRead = async (req, res, next) => {
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

    const updated = await prisma.notifications.update({
      where: { id: parseInt(id) },
      data: { status: 'Succeed' }
    });

    return sendSuccess(res, "Notification berhasil ditandai sudah dibaca", updated);
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await prisma.notifications.updateMany({
      where: { 
        user_id: req.user.id,
        status: 'pending'
      },
      data: { status: 'Succeed' }
    });

    return sendSuccess(res, "Semua notification berhasil ditandai sudah dibaca");
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