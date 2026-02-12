// src/controllers/auditLogs.controller.js
import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { generateExcelAuditLogs } from "../utils/exportHelper.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, entity_type, actor_id, start_date, end_date, search, page = 1, limit = 50 } = req.query;

    const where = {};
    
    if (action) where.action = action;
    if (entity_type) where.entity_type = entity_type;
    if (actor_id) where.actor_id = parseInt(actor_id);
    
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) {
        const startDateTime = new Date(start_date);
        startDateTime.setHours(0, 0, 0, 0);
        where.created_at.gte = startDateTime;
      }
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.created_at.lte = endDateTime;
      }
    }
    
    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [logs, total] = await Promise.all([
      prisma.auditLogs.findMany({
        where,
        include: { actor: true },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.auditLogs.count({ where })
    ]);

    return sendSuccess(res, "Data audit logs berhasil diambil", {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await prisma.auditLogs.findUnique({
      where: { id: parseInt(id) },
      include: { actor: true }
    });

    if (!log) {
      return sendError(res, "Audit log tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data audit log berhasil diambil", log);
  } catch (err) {
    next(err);
  }
};

export const getAuditLogsByEntity = async (req, res, next) => {
  try {
    const { entity_type, entity_id } = req.params;

    const logs = await prisma.auditLogs.findMany({
      where: {
        entity_type,
        entity_id: parseInt(entity_id)
      },
      include: { actor: true },
      orderBy: { created_at: 'desc' }
    });

    return sendSuccess(res, "Data audit logs berhasil diambil", logs);
  } catch (err) {
    next(err);
  }
};

export const getAuditLogsByActor = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date, action } = req.query;

    const where = { actor_id: parseInt(user_id) };
    
    if (action) where.action = action;
    
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) {
        const startDateTime = new Date(start_date);
        startDateTime.setHours(0, 0, 0, 0);
        where.created_at.gte = startDateTime;
      }
      if (end_date) {
        const endDateTime = new Date(end_date);
        endDateTime.setHours(23, 59, 59, 999);
        where.created_at.lte = endDateTime;
      }
    }

    const logs = await prisma.auditLogs.findMany({
      where,
      include: { actor: true },
      orderBy: { created_at: 'desc' }
    });

    return sendSuccess(res, "Data audit logs berhasil diambil", logs);
  } catch (err) {
    next(err);
  }
};

export const exportAuditLogs = async (req, res, next) => {
  try {
    const filters = req.query;

    const workbook = await generateExcelAuditLogs(filters);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=audit-logs-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};