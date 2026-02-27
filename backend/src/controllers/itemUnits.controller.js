import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/audit.js";

export const getItemUnits = async (req, res, next) => {
  try {
    const { status, item_id, location_id, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (item_id) where.item_id = parseInt(item_id);
    if (location_id) where.location_id = parseInt(location_id);
    if (search) {
      where.OR = [
        { unit_code: { contains: search, mode: "insensitive" } },
        { item: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const units = await prisma.itemUnits.findMany({
      where,
      include: {
        item: {
          include: { photos: true },
        },
        location: true,
      },
    });

    return sendSuccess(res, "Data item units berhasil diambil", units);
  } catch (err) {
    next(err);
  }
};

export const getItemUnitById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const unit = await prisma.itemUnits.findUnique({
      where: { id: parseInt(id) },
      include: {
        item: {
          include: { photos: true },
        },
        location: true,
        log_histories: {
          include: {
            from_location: true,
            to_location: true,
            moved_by: true,
          },
          orderBy: { moved_at: "desc" },
        },
      },
    });

    if (!unit) {
      return sendError(res, "Item unit tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data item unit berhasil diambil", unit);
  } catch (err) {
    next(err);
  }
};

export const getItemUnitByCode = async (req, res, next) => {
  try {
    const { unit_code } = req.params;

    const unit = await prisma.itemUnits.findUnique({
      where: { unit_code },
      include: {
        item: {
          include: { photos: true },
        },
        location: true,
        log_histories: {
          include: {
            from_location: true,
            to_location: true,
            moved_by: true,
          },
          orderBy: { moved_at: "desc" },
        },
      },
    });

    if (!unit) {
      return sendError(res, "Item unit tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data item unit berhasil diambil", unit);
  } catch (err) {
    next(err);
  }
};

export const updateItemUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { condition, status, location_id } = req.body;

    const existing = await prisma.itemUnits.findUnique({
      where: { id: parseInt(id) },
      include: { location: true },
    });

    if (!existing) {
      return sendError(res, "Item unit tidak ditemukan", 404);
    }

    const updateData = {};
    if (condition) updateData.condition = condition;
    if (status) updateData.status = status;
    if (location_id) updateData.location_id = parseInt(location_id);

    const unit = await prisma.itemUnits.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        item: true,
        location: true,
      },
    });

    if (location_id && parseInt(location_id) !== existing.location_id) {
      await prisma.itemLogHistory.create({
        data: {
          unit_id: unit.id,
          from_location_id: existing.location_id,
          to_location_id: parseInt(location_id),
          moved_by_id: req.user.id,
        },
      });
    }

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "UPDATE",
      entity_type: "ItemUnits",
      entity_id: unit.id,
      description: `Item unit ${unit.unit_code} diupdate oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Item unit berhasil diupdate", unit);
  } catch (err) {
    next(err);
  }
};

export const getItemUnitHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const unit = await prisma.itemUnits.findUnique({
      where: { id: parseInt(id) },
    });

    if (!unit) {
      return sendError(res, "Item unit tidak ditemukan", 404);
    }

    const histories = await prisma.itemLogHistory.findMany({
      where: { unit_id: parseInt(id) },
      include: {
        from_location: true,
        to_location: true,
        moved_by: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
          },
        },
        request: {
          select: {
            id: true,
            request_code: true,
            request_type: true,
            status: true,
          },
        },
      },
      orderBy: { moved_at: "desc" },
    });

    return sendSuccess(res, "Riwayat lokasi berhasil diambil", histories);
  } catch (err) {
    next(err);
  }
};
