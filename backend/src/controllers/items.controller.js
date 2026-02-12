import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/audit.js";
import { generateModelCode, generateUnitCode, generateMultipleUnitCodes } from "../utils/smartCode.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createItem = async (req, res, next) => {
  try {
    const { name, category, procurement_year, quantity, location_id } = req.body;

    if (!name || !category || !procurement_year || !quantity || !location_id) {
      return sendError(res, "Semua field wajib diisi", 400);
    }

    const location = await prisma.locations.findUnique({ 
      where: { id: parseInt(location_id) } 
    });

    if (!location) {
      return sendError(res, "Lokasi tidak ditemukan", 404);
    }

   const model_code = await generateModelCode(category, parseInt(procurement_year));
   
   const item = await prisma.items.create({
        data: {
            name,
            model_code,
            category,
            procurement_year: parseInt(procurement_year),
        },
    });

    const unitCodes = await generateMultipleUnitCodes(item.id, parseInt(quantity));
    const unitsData = unitCodes.map(code => ({
    unit_code: code,
    item_id: item.id,
    location_id: parseInt(location_id),
    }));

    await prisma.itemUnits.createMany({ data: unitsData });

    if (req.files && req.files.length > 0) {
      const photoData = req.files.map((file) => ({
        file_path: `/uploads/items/${file.filename}`,
        item_id: item.id,
      }));
      await prisma.itemPhotos.createMany({ data: photoData });
    }

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "CREATE",
      entity_type: "Items",
      entity_id: item.id,
      description: `Item ${item.name} dengan ${quantity} unit ditambahkan oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    const itemWithDetails = await prisma.items.findUnique({
      where: { id: item.id },
      include: { 
        photos: true,
        units: {
          include: { location: true }
        }
      },
    });

    return sendSuccess(res, "Item berhasil ditambahkan", itemWithDetails, 201);
  } catch (err) {
    next(err);
  }
};

export const restockItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, location_id } = req.body;

    if (!quantity || !location_id) {
      return sendError(res, "Quantity dan location_id wajib diisi", 400);
    }

    const item = await prisma.items.findUnique({ where: { id: parseInt(id) } });

    if (!item) {
      return sendError(res, "Item tidak ditemukan", 404);
    }

    const location = await prisma.locations.findUnique({ 
      where: { id: parseInt(location_id) } 
    });

    if (!location) {
      return sendError(res, "Lokasi tidak ditemukan", 404);
    }

    const unitCodes = await generateMultipleUnitCodes(item.id, parseInt(quantity));
    const unitsData = unitCodes.map(code => ({
      unit_code: code,
      item_id: item.id,
      location_id: parseInt(location_id),
    }));

    await prisma.itemUnits.createMany({ data: unitsData });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "CREATE",
      entity_type: "ItemUnits",
      entity_id: item.id,
      description: `Restock ${quantity} unit untuk ${item.name} oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    const itemWithDetails = await prisma.items.findUnique({
      where: { id: item.id },
      include: { 
        photos: true,
        units: {
          include: { location: true }
        }
      },
    });

    return sendSuccess(res, "Restock berhasil", itemWithDetails, 201);
  } catch (err) {
    next(err);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const { search } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { model_code: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.items.findMany({
      where,
      include: { 
        photos: true,
        _count: {
          select: {
            units: true
          }
        }
      },
    });

    const itemsWithStats = await Promise.all(
      items.map(async (item) => {
        const stats = await prisma.itemUnits.groupBy({
          by: ['status'],
          where: { item_id: item.id },
          _count: true,
        });

        const statusCounts = {
          available: 0,
          borrowed: 0,
          transferred: 0,
          sold: 0,
          demolished: 0,
        };

        stats.forEach(stat => {
          statusCounts[stat.status] = stat._count;
        });

        return {
          ...item,
          total_units: item._count.units,
          ...statusCounts,
        };
      })
    );

    return sendSuccess(res, "Data items berhasil diambil", itemsWithStats);
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await prisma.items.findUnique({
      where: { id: parseInt(id) },
      include: { 
        photos: true,
        units: {
          include: { location: true }
        }
      },
    });

    if (!item) {
      return sendError(res, "Item tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data item berhasil diambil", item);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const existing = await prisma.items.findUnique({ where: { id: parseInt(id) } });

    if (!existing) {
      return sendError(res, "Item tidak ditemukan", 404);
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;

    const item = await prisma.items.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { photos: true, units: true },
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "UPDATE",
      entity_type: "Items",
      entity_id: item.id,
      description: `Item ${item.name} diupdate oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Item berhasil diupdate", item);
  } catch (err) {
    next(err);
  }
};

export const addItemPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await prisma.items.findUnique({
      where: { id: parseInt(id) },
      include: { photos: true },
    });

    if (!item) {
      return sendError(res, "Item tidak ditemukan", 404);
    }

    if (item.photos.length >= 3) {
      return sendError(res, "Maksimal 3 foto per item", 400);
    }

    if (!req.files || req.files.length === 0) {
      return sendError(res, "File foto tidak ditemukan", 400);
    }

    const remainingSlots = 3 - item.photos.length;
    const filesToUpload = req.files.slice(0, remainingSlots);

    const photoData = filesToUpload.map((file) => ({
      file_path: `/uploads/items/${file.filename}`,
      item_id: item.id,
    }));

    await prisma.itemPhotos.createMany({ data: photoData });

    const updatedItem = await prisma.items.findUnique({
      where: { id: parseInt(id) },
      include: { photos: true },
    });

    return sendSuccess(res, "Foto berhasil ditambahkan", updatedItem);
  } catch (err) {
    next(err);
  }
};

export const deleteItemPhoto = async (req, res, next) => {
  try {
    const { id, photoId } = req.params;

    const photo = await prisma.itemPhotos.findFirst({
      where: { id: parseInt(photoId), item_id: parseInt(id) },
    });

    if (!photo) {
      return sendError(res, "Foto tidak ditemukan", 404);
    }

    const filePath = path.join(__dirname, "../../", photo.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.itemPhotos.delete({ where: { id: parseInt(photoId) } });

    return sendSuccess(res, "Foto berhasil dihapus");
  } catch (err) {
    next(err);
  }
};

