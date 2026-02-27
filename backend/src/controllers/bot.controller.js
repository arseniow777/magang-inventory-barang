import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        created_at: true,
      },
    });

    if (!user) return sendError(res, "User tidak ditemukan", 404);

    return sendSuccess(res, "Data user berhasil diambil", user);
  } catch (err) {
    next(err);
  }
};

export const getLatestRequestByTelegram = async (req, res, next) => {
  try {
    const { telegram_id } = req.params;

    const user = await prisma.users.findFirst({ where: { telegram_id } });
    if (!user) return sendError(res, "User tidak ditemukan", 404);

    const request = await prisma.requests.findFirst({
      where: { pic_id: user.id },
      include: {
        destination_location: true,
        _count: { select: { request_items: true } },
      },
      orderBy: { created_at: "desc" },
    });

    if (!request) return sendError(res, "Belum ada riwayat request", 404);

    return sendSuccess(res, "Data request terbaru berhasil diambil", request);
  } catch (err) {
    next(err);
  }
};

export const getLatestReportByTelegram = async (req, res, next) => {
  try {
    const { telegram_id } = req.params;

    const user = await prisma.users.findFirst({ where: { telegram_id } });
    if (!user) return sendError(res, "User tidak ditemukan", 404);

    const report = await prisma.officialReports.findFirst({
      where: {
        request: { pic_id: user.id },
        is_approved: true,
      },
      include: { request: true },
      orderBy: { issued_date: "desc" },
    });

    if (!report) return sendError(res, "Belum ada riwayat berita acara", 404);

    return sendSuccess(
      res,
      "Data berita acara terbaru berhasil diambil",
      report,
    );
  } catch (err) {
    next(err);
  }
};

// Endpoint khusus bot — tidak perlu auth, hanya bisa diakses internal
export const downloadReportForBot = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.officialReports.findUnique({
      where: { id: parseInt(id) },
    });

    if (!report) return sendError(res, "Report tidak ditemukan", 404);
    if (!report.is_approved)
      return sendError(res, "Report belum diapprove", 403);

    const filePath = path.join(__dirname, "../../", report.file_path);

    if (!fs.existsSync(filePath)) {
      return sendError(res, "File PDF tidak ditemukan", 404);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${report.report_number}.pdf`,
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
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

    const user = await prisma.users.findFirst({ where: { telegram_id } });
    if (!user) return sendError(res, "User tidak ditemukan", 404);

    const admins = await prisma.users.findMany({ where: { role: "admin" } });

    await Promise.all(
      admins.map((admin) =>
        prisma.notifications.create({
          data: {
            user_id: admin.id,
            message: `Pesan dari ${user.name} (${user.username}): ${message}`,
            type: "system",
          },
        }),
      ),
    );

    return sendSuccess(res, "Pesan berhasil dikirim ke admin");
  } catch (err) {
    next(err);
  }
};
