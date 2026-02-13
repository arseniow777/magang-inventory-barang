import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getReports = async (req, res, next) => {
  try {
    const { report_type } = req.query;

    const where = {};
    if (report_type) where.report_type = report_type;

    const reports = await prisma.officialReports.findMany({
      where,
      include: {
        request: {
          include: {
            pic: true,
            destination_location: true
          }
        },
        issued_by: true
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
        issued_by: true
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
        issued_by: true
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

export const downloadReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.officialReports.findUnique({
      where: { id: parseInt(id) }
    });

    if (!report) {
      return sendError(res, "Report tidak ditemukan", 404);
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