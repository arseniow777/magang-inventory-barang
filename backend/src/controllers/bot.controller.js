import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getUserByTelegram = async (req, res, next) => {
  try {
    const { telegram_id } = req.params;

    const user = await prisma.users.findFirst({
      where: { telegram_id },
      select: {
        id: true,
        employee_id: true,
        username: true,
        name: true,
        role: true,
        phone_number: true,
        created_at: true
      }
    });

    if (!user) {
      return sendError(res, "User tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data user berhasil diambil", user);
  } catch (err) {
    next(err);
  }
};

export const getLatestRequestByTelegram = async (req, res, next) => {
  try {
    const { telegram_id } = req.params;

    const user = await prisma.users.findFirst({
      where: { telegram_id }
    });

    if (!user) {
      return sendError(res, "User tidak ditemukan", 404);
    }

    const request = await prisma.requests.findFirst({
      where: { pic_id: user.id },
      include: {
        destination_location: true,
        _count: {
          select: { request_items: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    if (!request) {
      return sendError(res, "Belum ada request", 404);
    }

    return sendSuccess(res, "Data request terbaru berhasil diambil", request);
  } catch (err) {
    next(err);
  }
};

export const getLatestReportByTelegram = async (req, res, next) => {
  try {
    const { telegram_id } = req.params;

    const user = await prisma.users.findFirst({
      where: { telegram_id }
    });

    if (!user) {
      return sendError(res, "User tidak ditemukan", 404);
    }

    const report = await prisma.officialReports.findFirst({
      where: {
        request: {
          pic_id: user.id
        },
        is_approved: true
      },
      include: {
        request: true
      },
      orderBy: { issued_date: 'desc' }
    });

    if (!report) {
      return sendError(res, "Belum ada berita acara", 404);
    }

    return sendSuccess(res, "Data berita acara terbaru berhasil diambil", report);
  } catch (err) {
    next(err);
  }
};

export const contactAdmin = async (req, res, next) => {
  try {
    const { telegram_id, message } = req.body;

    if (!telegram_id || !message) {
      return sendError(res, "Telegram ID dan message wajib diisi", 400);
    }

    const user = await prisma.users.findFirst({
      where: { telegram_id }
    });

    if (!user) {
      return sendError(res, "User tidak ditemukan", 404);
    }

    const admins = await prisma.users.findMany({
      where: { role: 'admin' }
    });

    await Promise.all(
      admins.map(admin =>
        prisma.notifications.create({
          data: {
            user_id: admin.id,
            message: `Pesan dari ${user.name}: ${message}`,
            type: 'system',
            status: 'pending'
          }
        })
      )
    );

    return sendSuccess(res, "Pesan berhasil dikirim ke admin");
  } catch (err) {
    next(err);
  }
};