// inventoryFunctions.js
import prisma from "../config/prisma.js";

export async function getItemInfo(keyword) {
  const items = await prisma.itemMasters.findMany({
    where: {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { model_code: { contains: keyword, mode: "insensitive" } },
        { category: { contains: keyword, mode: "insensitive" } },
      ],
    },
    include: {
      pic: { select: { name: true, employee_id: true } },
      units: {
        include: {
          location: { select: { building_name: true, floor: true } },
          request_items: {
            where: {
              request: {
                status: "approved",
                returned_at: null,
              },
            },
            include: {
              request: {
                select: {
                  request_code: true,
                  approved_at: true,
                  pic: { select: { name: true, employee_id: true } },
                },
              },
            },
            take: 1,
          },
        },
      },
    },
    take: 5,
  });

  if (items.length === 0) {
    return { found: false, message: `Barang "${keyword}" tidak ditemukan.` };
  }

  const result = items.map((item) => {
    const unitList = item.units.map((u) => {
      const location = u.location
        ? `${u.location.building_name} Lt.${u.location.floor}`
        : "Lokasi tidak tersedia";

      let pic = null;
      if (u.status === "borrowed" && u.request_items.length > 0) {
        const req = u.request_items[0].request;
        pic = {
          name: req.pic.name,
          employee_id: req.pic.employee_id,
          request_code: req.request_code,
          borrowed_since: req.approved_at,
        };
      }

      return { unit_code: u.unit_code, status: u.status, condition: u.condition, location, pic };
    });

    return {
      name: item.name,
      model_code: item.model_code,
      category: item.category,
      procurement_year: item.procurement_year,
      total_units: item.units.length,
      pic_master: item.pic ? item.pic.name : null,
      units: unitList,
    };
  });

  return { found: true, items: result };
}

export async function getAvailableItems(keyword) {
  const where = { status: "available" };
  if (keyword) {
    where.item = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { category: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }

  const units = await prisma.itemUnits.findMany({
    where,
    include: {
      item: { select: { id: true, name: true, category: true } },
      location: { select: { building_name: true, floor: true } },
    },
    take: 20,
  });

  if (units.length === 0) {
    return { found: false, message: "Tidak ada barang yang tersedia." };
  }

  const grouped = {};
  for (const unit of units) {
    const key = unit.item_id;
    if (!grouped[key]) {
      grouped[key] = { name: unit.item.name, category: unit.item.category, count: 0, locations: new Set() };
    }
    grouped[key].count++;
    if (unit.location) {
      grouped[key].locations.add(`${unit.location.building_name} Lt.${unit.location.floor}`);
    }
  }

  const result = Object.values(grouped).map((g) => ({ ...g, locations: [...g.locations] }));
  return { found: true, total: units.length, items: result };
}

export async function getMostBorrowedItems(limit) {
  const grouped = await prisma.requestItems.groupBy({
    by: ["unit_id"],
    _count: { unit_id: true },
    orderBy: { _count: { unit_id: "desc" } },
    take: limit * 3,
  });

  if (grouped.length === 0) {
    return { found: false, message: "Belum ada data peminjaman." };
  }

  const unitIds = grouped.map((g) => g.unit_id);
  const units = await prisma.itemUnits.findMany({
    where: { id: { in: unitIds } },
    include: { item: { select: { id: true, name: true, category: true } } },
  });

  const unitMap = Object.fromEntries(units.map((u) => [u.id, u]));
  const itemCounts = {};

  for (const g of grouped) {
    const unit = unitMap[g.unit_id];
    if (!unit) continue;
    const itemId = unit.item.id;
    if (!itemCounts[itemId]) {
      itemCounts[itemId] = { name: unit.item.name, category: unit.item.category, count: 0 };
    }
    itemCounts[itemId].count += g._count.unit_id;
  }

  const result = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, limit);
  return { found: true, items: result };
}

export async function getUserActiveLoans(userId) {
  if (!userId) return { error: "User tidak teridentifikasi." };

  const loans = await prisma.requests.findMany({
    where: {
      pic_id: userId,
      request_type: "borrow",
      status: { in: ["approved", "pending"] },
      returned_at: null,
    },
    include: {
      request_items: {
        include: {
          unit: {
            include: {
              item: { select: { name: true } },
              location: { select: { building_name: true, floor: true } },
            },
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
    take: 5,
  });

  if (loans.length === 0) {
    return { found: false, message: "Tidak ada pinjaman aktif." };
  }

  const result = loans.map((r) => ({
    request_code: r.request_code,
    status: r.status,
    created_at: r.created_at,
    items: r.request_items.map((ri) => ({
      name: ri.unit.item.name,
      unit_code: ri.unit.unit_code,
      location: ri.unit.location
        ? `${ri.unit.location.building_name} Lt.${ri.unit.location.floor}`
        : "Lokasi tidak tersedia",
    })),
  }));

  return { found: true, loans: result };
}

export async function getItemLocation(keyword) {
  const units = await prisma.itemUnits.findMany({
    where: {
      OR: [
        { item: { name: { contains: keyword, mode: "insensitive" } } },
        { unit_code: { contains: keyword, mode: "insensitive" } },
      ],
    },
    include: {
      item: { select: { name: true, category: true } },
      location: { select: { building_name: true, floor: true, address: true } },
    },
    take: 10,
  });

  if (units.length === 0) {
    return { found: false, message: `Barang "${keyword}" tidak ditemukan.` };
  }

  const result = units.map((u) => ({
    name: u.item.name,
    unit_code: u.unit_code,
    condition: u.condition,
    status: u.status,
    location: u.location ? `${u.location.building_name}, Lantai ${u.location.floor}` : "Lokasi tidak tersedia",
    address: u.location?.address ?? null,
  }));

  return { found: true, items: result };
}

export async function getItemStock(keyword) {
  const units = await prisma.itemUnits.findMany({
    where: {
      OR: [
        { item: { name: { contains: keyword, mode: "insensitive" } } },
        { item: { category: { contains: keyword, mode: "insensitive" } } },
      ],
    },
    select: { status: true, item: { select: { name: true } } },
  });

  if (units.length === 0) {
    return { found: false, message: `Tidak ada data untuk "${keyword}".` };
  }

  const summary = units.reduce((acc, u) => {
    acc[u.status] = (acc[u.status] || 0) + 1;
    return acc;
  }, {});

  return { found: true, keyword, total: units.length, breakdown: summary };
}

export async function getItemHistoryLocation(keyword) {
  const where = {};
  if (keyword) {
    where.unit = {
      OR: [
        { unit_code: { contains: keyword, mode: "insensitive" } },
        { item: { name: { contains: keyword, mode: "insensitive" } } },
      ],
    };
  }

  const logs = await prisma.itemLogHistory.findMany({
    where,
    include: {
      unit: { include: { item: { select: { name: true, category: true } } } },
      from_location: { select: { building_name: true, floor: true, address: true } },
      to_location: { select: { building_name: true, floor: true, address: true } },
      request: { select: { request_code: true, request_type: true } },
      moved_by: { select: { name: true, employee_id: true } },
    },
    orderBy: { moved_at: "desc" },
    take: 20,
  });

  if (logs.length === 0) {
    return {
      found: false,
      message: keyword
        ? `Tidak ada riwayat transfer untuk "${keyword}".`
        : "Belum ada riwayat transfer barang.",
    };
  }

  const result = logs.map((log) => ({
    unit_code: log.unit.unit_code,
    item_name: log.unit.item.name,
    category: log.unit.item.category,
    moved_at: log.moved_at,
    from: log.from_location ? `${log.from_location.building_name} Lt.${log.from_location.floor}` : "Tidak diketahui",
    to: log.to_location ? `${log.to_location.building_name} Lt.${log.to_location.floor}` : "Tidak diketahui",
    request_code: log.request?.request_code ?? null,
    request_type: log.request?.request_type ?? null,
    moved_by: log.moved_by.name,
  }));

  return { found: true, total: logs.length, history: result };
}