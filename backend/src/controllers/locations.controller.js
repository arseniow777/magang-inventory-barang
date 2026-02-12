import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/audit.js";

export const getLocations = async (req, res, next) => {
  try {
    const locations = await prisma.locations.findMany();
    return sendSuccess(res, "Data lokasi berhasil diambil", locations);
  } catch (err) {
    next(err);
  }
};

export const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const location = await prisma.locations.findUnique({
      where: { id: parseInt(id) },
    });

    if (!location) {
      return sendError(res, "Lokasi tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data lokasi berhasil diambil", location);
  } catch (err) {
    next(err);
  }
};

export const createLocation = async (req, res, next) => {
  try {
    const { building_name, floor, address } = req.body;

    const prefix = building_name.substring(0, 3).toLowerCase(); 
    const floorNumberStr = floor.toString().replace(/\D/g, '');   
    const generatedCode = `${prefix}-${floorNumberStr}`;

    if (!building_name || !floor || !address) {
      return sendError(res, "Semua field wajib diisi", 400);
    }

    const existing = await prisma.locations.findUnique({ where: { location_code: generatedCode } });
    const floorInt = parseInt(floorNumberStr);

    if (existing) {
      return sendError(res, "Location code sudah digunakan", 400);
    }

    const location = await prisma.locations.create({
      data: { location_code: generatedCode, building_name, floor: floorInt, address },
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "CREATE",
      entity_type: "Locations",
      entity_id: location.id,
      description: `Lokasi ${location.building_name} ditambahkan oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Lokasi berhasil ditambahkan", location, 201);
  } catch (err) {
    next(err);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { building_name, floor, address } = req.body;

    const existing = await prisma.locations.findUnique({ where: { id: parseInt(id) } });

    if (!existing) {
      return sendError(res, "Lokasi tidak ditemukan", 404);
    }

    const updateData = {};
    if (address) updateData.address = address;

    if (building_name || floor) {
      const newBuilding = building_name || existing.building_name;
      const newFloor = floor !== undefined ? floor : existing.floor;

      const prefix = newBuilding.substring(0, 3).toLowerCase();
      const floorNumberStr = newFloor.toString().replace(/\D/g, '');
      const newGeneratedCode = `${prefix}-${floorNumberStr}`;

      updateData.building_name = newBuilding;
      updateData.floor = parseInt(floorNumberStr);
      updateData.location_code = newGeneratedCode;

      const codeConflict = await prisma.locations.findFirst({
        where: { 
          location_code: newGeneratedCode,
          NOT: { id: parseInt(id) } 
        }
      });

      if (codeConflict) {
        return sendError(res, `Gagal update: Kode ${newGeneratedCode} sudah digunakan oleh lokasi lain`, 400);
      }
    }

    const location = await prisma.locations.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "UPDATE",
      entity_type: "Locations",
      entity_id: location.id,
      description: `Lokasi ${location.building_name} diupdate oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Lokasi berhasil diupdate", location);
  } catch (err) {
    next(err);
  }
};

export const deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.locations.findUnique({
      where: { id: parseInt(id) },
      include: { items: true },
    });

    if (!existing) {
      return sendError(res, "Lokasi tidak ditemukan", 404);
    }

    if (existing.items.length > 0) {
      return sendError(res, "Lokasi tidak bisa dihapus karena masih memiliki item", 400);
    }

    await prisma.locations.delete({ where: { id: parseInt(id) } });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "DELETE",
      entity_type: "Locations",
      entity_id: existing.id,
      description: `Lokasi ${existing.building_name} dihapus oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Lokasi berhasil dihapus");
  } catch (err) {
    next(err);
  }
};