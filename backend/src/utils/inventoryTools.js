import prisma from "../config/prisma.js";

// ─── Ollama Tool Declarations ─────────────────────────────────────────────────

export const toolDeclarations = [
  {
    type: "function",
    function: {
      name: "getAvailableItems",
      description:
        "Mendapatkan daftar barang yang tersedia (status available) di inventaris. Bisa difilter berdasarkan nama atau kategori barang.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description:
              "Kata kunci pencarian nama atau kategori barang. Kosongkan untuk semua barang.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getMostBorrowedItems",
      description:
        "Mendapatkan daftar barang yang paling sering dipinjam berdasarkan jumlah request.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Jumlah barang yang ingin ditampilkan. Default 5.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getUserActiveLoans",
      description:
        "Mendapatkan daftar pinjaman aktif milik user yang sedang mengirim pesan ini.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getItemLocation",
      description:
        "Mencari lokasi/keberadaan barang tertentu di dalam gudang atau gedung.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description: "Nama atau kode barang yang ingin dicari lokasinya.",
          },
        },
        required: ["keyword"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getItemStock",
      description:
        "Melihat jumlah total stok barang beserta rincian statusnya (available, borrowed, dll).",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description:
              "Nama atau kategori barang yang ingin dilihat stoknya.",
          },
        },
        required: ["keyword"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getOverdueItems",
      description:
        "Mendapatkan daftar barang yang masih dipinjam dan belum dikembalikan (melampaui waktu normal).",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getItemInfo",
      description:
        "Mendapatkan informasi lengkap tentang suatu barang: deskripsi, stok, kondisi, dan lokasi unit-unitnya.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description:
              "Nama atau model barang yang ingin dilihat informasinya.",
          },
        },
        required: ["keyword"],
      },
    },
  },
];

// ─── Tool Executors (Prisma Queries) ─────────────────────────────────────────

export const executeTool = async (toolName, args, userId) => {
  switch (toolName) {
    case "getAvailableItems":
      return await getAvailableItems(args.keyword);

    case "getMostBorrowedItems":
      return await getMostBorrowedItems(args.limit || 5);

    case "getUserActiveLoans":
      return await getUserActiveLoans(userId);

    case "getItemLocation":
      return await getItemLocation(args.keyword);

    case "getItemStock":
      return await getItemStock(args.keyword);

    case "getOverdueItems":
      return await getOverdueItems();

    case "getItemInfo":
      return await getItemInfo(args.keyword);

    default:
      return { error: "Tool tidak dikenali." };
  }
};

// ─── Individual Query Functions ───────────────────────────────────────────────

async function getItemInfo(keyword) {
  const items = await prisma.itemMasters.findMany({
    where: {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { model_code: { contains: keyword, mode: "insensitive" } },
        { category: { contains: keyword, mode: "insensitive" } },
      ],
    },
    include: {
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

      return {
        unit_code: u.unit_code,
        status: u.status,
        condition: u.condition,
        location,
        pic,
      };
    });

    return {
      name: item.name,
      model_code: item.model_code,
      category: item.category,
      procurement_year: item.procurement_year,
      total_units: item.units.length,
      units: unitList,
    };
  });

  return { found: true, items: result };
}

async function getAvailableItems(keyword) {
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

  // Group by item ID — handles multiple item masters with the same name
  const grouped = {};
  for (const unit of units) {
    const key = unit.item_id;
    if (!grouped[key]) {
      grouped[key] = {
        name: unit.item.name,
        category: unit.item.category,
        count: 0,
        locations: new Set(),
      };
    }
    grouped[key].count++;
    if (unit.location) {
      grouped[key].locations.add(
        `${unit.location.building_name} Lt.${unit.location.floor}`,
      );
    }
  }

  const result = Object.values(grouped).map((g) => ({
    ...g,
    locations: [...g.locations],
  }));

  return { found: true, total: units.length, items: result };
}

async function getMostBorrowedItems(limit) {
  // Group request items by unit, then aggregate by item
  const grouped = await prisma.requestItems.groupBy({
    by: ["unit_id"],
    _count: { unit_id: true },
    orderBy: { _count: { unit_id: "desc" } },
    take: limit * 3, // take extra to handle deduplication by item
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

  // Aggregate by item (not unit)
  const itemCounts = {};
  for (const g of grouped) {
    const unit = unitMap[g.unit_id];
    if (!unit) continue;
    const itemId = unit.item.id;
    if (!itemCounts[itemId]) {
      itemCounts[itemId] = {
        name: unit.item.name,
        category: unit.item.category,
        count: 0,
      };
    }
    itemCounts[itemId].count += g._count.unit_id;
  }

  const result = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return { found: true, items: result };
}

async function getUserActiveLoans(userId) {
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

async function getItemLocation(keyword) {
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
    location: u.location
      ? `${u.location.building_name}, Lantai ${u.location.floor}`
      : "Lokasi tidak tersedia",
    address: u.location?.address ?? null,
  }));

  return { found: true, items: result };
}

async function getItemStock(keyword) {
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

  return {
    found: true,
    keyword,
    total: units.length,
    breakdown: summary,
  };
}

async function getOverdueItems() {
  // Borrowed items older than 7 days with no return
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const overdue = await prisma.requests.findMany({
    where: {
      request_type: "borrow",
      status: "approved",
      returned_at: null,
      approved_at: { lt: sevenDaysAgo },
    },
    include: {
      pic: { select: { name: true } },
      request_items: {
        include: { unit: { include: { item: { select: { name: true } } } } },
      },
    },
    take: 10,
  });

  if (overdue.length === 0) {
    return {
      found: false,
      message: "Tidak ada barang yang terlambat dikembalikan.",
    };
  }

  const result = overdue.map((r) => ({
    request_code: r.request_code,
    pic_name: r.pic.name,
    approved_at: r.approved_at,
    days_overdue: Math.floor(
      (new Date() - new Date(r.approved_at)) / (1000 * 60 * 60 * 24),
    ),
    items: r.request_items.map((ri) => ri.unit.item.name),
  }));

  return { found: true, overdues: result };
}
