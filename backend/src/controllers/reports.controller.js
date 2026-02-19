import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/audit.js";
import { sendTelegramMessage } from "../utils/telegramBot.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getReports = async (req, res, next) => {
  try {
    const { report_type, is_approved } = req.query;

    const where = {};
    if (report_type) where.report_type = report_type;
    if (is_approved !== undefined) where.is_approved = is_approved === 'true';

    const reports = await prisma.officialReports.findMany({
      where,
      include: {
        request: {
          include: {
            pic: true,
            destination_location: true
          }
        },
        issued_by: true,
        approved_by: true
      },
      orderBy: { issued_date: 'desc' }
    });

    return sendSuccess(res, "Data reports berhasil diambil", reports);
  } catch (err) {
    next(err);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.officialReports.findUnique({
      where: { id: parseInt(id) },
      include: {
        request: {
          include: {
            pic: true,
            admin: true,
            destination_location: true,
            request_items: {
              include: {
                unit: {
                  include: {
                    item: true,
                    location: true
                  }
                }
              }
            }
          }
        },
        issued_by: true,
        approved_by: true
      }
    });

    if (!report) {
      return sendError(res, "Report tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data report berhasil diambil", report);
  } catch (err) {
    next(err);
  }
};

export const getReportByRequestId = async (req, res, next) => {
  try {
    const { request_id } = req.params;

    const report = await prisma.officialReports.findUnique({
      where: { request_id: parseInt(request_id) },
      include: {
        request: {
          include: {
            pic: true,
            admin: true,
            destination_location: true,
            request_items: {
              include: {
                unit: {
                  include: {
                    item: true,
                    location: true
                  }
                }
              }
            }
          }
        },
        issued_by: true,
        approved_by: true
      }
    });

    if (!report) {
      return sendError(res, "Report tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data report berhasil diambil", report);
  } catch (err) {
    next(err);
  }
};

export const approveReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.officialReports.findUnique({
      where: { id: parseInt(id) },
      include: {
        request: {
          include: { pic: true }
        }
      }
    });

    if (!report) {
      return sendError(res, "Report tidak ditemukan", 404);
    }

    if (report.is_approved) {
      return sendError(res, "Report sudah diapprove", 400);
    }

    const updated = await prisma.officialReports.update({
      where: { id: parseInt(id) },
      data: {
        is_approved: true,
        approved_by_id: req.user.id,
        approved_at: new Date()
      },
      include: {
        request: {
          include: { pic: true }
        },
        approved_by: true
      }
    });

    await prisma.notifications.create({
      data: {
        user_id: report.request.pic_id,
        message: `Berita acara ${report.report_number} telah disetujui. Anda dapat mendownload sekarang.`
      }
    });

    if (report.request.pic.telegram_id) {
      await sendTelegramMessage(
        report.request.pic.telegram_id,
        `✅ Berita acara ${report.report_number} telah disetujui!\n\nAnda dapat mendownload berita acara melalui aplikasi.`
      );
    }

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "APPROVE",
      entity_type: "OfficialReports",
      entity_id: report.id,
      description: `Admin ${req.user.username} menyetujui berita acara ${report.report_number}`,
      user_agent: req.headers["user-agent"]
    });

    return sendSuccess(res, "Report berhasil diapprove", updated);
  } catch (err) {
    next(err);
  }
};

export const rejectReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.officialReports.findUnique({
      where: { id: parseInt(id) },
      include: {
        request: {
          include: { pic: true }
        }
      }
    });

    if (!report) {
      return sendError(res, "Report tidak ditemukan", 404);
    }

    if (report.is_approved) {
      return sendError(res, "Report sudah diapprove, tidak bisa direject", 400);
    }

    await prisma.notifications.create({
      data: {
        user_id: report.request.pic_id,
        message: `Berita acara ${report.report_number} ditolak. Silakan hubungi admin.`
      }
    });

    if (report.request.pic.telegram_id) {
      await sendTelegramMessage(
        report.request.pic.telegram_id,
        `❌ Berita acara ${report.report_number} ditolak.\n\nSilakan hubungi admin untuk informasi lebih lanjut.`
      );
    }

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "REJECT",
      entity_type: "OfficialReports",
      entity_id: report.id,
      description: `Admin ${req.user.username} menolak berita acara ${report.report_number}`,
      user_agent: req.headers["user-agent"]
    });

    return sendSuccess(res, "Report berhasil direject");
  } catch (err) {
    next(err);
  }
};

export const downloadReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.officialReports.findUnique({
      where: { id: parseInt(id) },
      include: {
        request: true
      }
    });

    if (!report) {
      return sendError(res, "Report tidak ditemukan", 404);
    }

    if (!report.is_approved && req.user.role !== 'admin') {
      return sendError(res, "Report belum diapprove, tidak dapat didownload", 403);
    }

    const filePath = path.join(__dirname, "../../", report.file_path);

    if (!fs.existsSync(filePath)) {
      return sendError(res, "File PDF tidak ditemukan", 404);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${report.report_number}.pdf`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
};