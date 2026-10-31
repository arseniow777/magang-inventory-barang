import assert from "node:assert/strict";
import { after, test } from "node:test";
import prisma from "../src/config/prisma.js";
import { getAuditLogs } from "../src/controllers/auditLogs.controller.js";
import { getItems } from "../src/controllers/items.controller.js";
import { getItemUnits } from "../src/controllers/itemUnits.controller.js";

after(async () => {
  await prisma.$disconnect();
});

function createResponse() {
  return {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return body;
    },
  };
}

async function withMockedMethods(mocks, run) {
  const originals = mocks.map(([target, method, implementation]) => {
    const original = target[method];
    target[method] = implementation;
    return [target, method, original];
  });

  try {
    await run();
  } finally {
    for (const [target, method, original] of originals.reverse()) {
      target[method] = original;
    }
  }
}

test("getItemUnits applies status, item, location, and search filters", async () => {
  const units = [{ id: 7, unit_code: "CAM-007" }];
  let query;
  const res = createResponse();

  await withMockedMethods(
    [
      [
        prisma.itemUnits,
        "findMany",
        async (options) => {
          query = options;
          return units;
        },
      ],
    ],
    async () => {
      await getItemUnits(
        {
          query: {
            status: "available",
            item_id: "12",
            location_id: "4",
            search: "cam",
          },
        },
        res,
        (error) => {
          throw error;
        },
      );
    },
  );

  assert.deepEqual(query.where, {
    status: "available",
    item_id: 12,
    location_id: 4,
    OR: [
      { unit_code: { contains: "cam", mode: "insensitive" } },
      { item: { name: { contains: "cam", mode: "insensitive" } } },
    ],
  });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data, units);
});

test("getItems applies search across item name, model code, and category", async () => {
  let itemQuery;
  let groupByQuery;
  const res = createResponse();

  await withMockedMethods(
    [
      [
        prisma.itemMasters,
        "findMany",
        async (options) => {
          itemQuery = options;
          return [
            {
              id: 5,
              _count: { units: 2 },
            },
          ];
        },
      ],
      [
        prisma.itemUnits,
        "groupBy",
        async (options) => {
          groupByQuery = options;
          return [{ status: "available", _count: 2 }];
        },
      ],
    ],
    async () => {
      await getItems(
        { query: { search: "laptop" } },
        res,
        (error) => {
          throw error;
        },
      );
    },
  );

  assert.deepEqual(itemQuery.where, {
    OR: [
      { name: { contains: "laptop", mode: "insensitive" } },
      { model_code: { contains: "laptop", mode: "insensitive" } },
      { category: { contains: "laptop", mode: "insensitive" } },
    ],
  });
  assert.deepEqual(groupByQuery, {
    by: ["status"],
    where: { item_id: 5 },
    _count: true,
  });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data[0], {
    id: 5,
    _count: { units: 2 },
    total_units: 2,
    available: 2,
    borrowed: 0,
    transferred: 0,
    sold: 0,
    demolished: 0,
  });
});

test("getAuditLogs applies filters and returns the requested pagination", async () => {
  let listQuery;
  let countQuery;
  const logs = [{ id: 1 }, { id: 2 }];
  const res = createResponse();

  await withMockedMethods(
    [
      [
        prisma.auditLogs,
        "findMany",
        async (options) => {
          listQuery = options;
          return logs;
        },
      ],
      [
        prisma.auditLogs,
        "count",
        async (options) => {
          countQuery = options;
          return 21;
        },
      ],
    ],
    async () => {
      await getAuditLogs(
        {
          query: {
            action: "CREATE",
            entity_type: "Items",
            actor_id: "9",
            search: "laptop",
            page: "3",
            limit: "10",
          },
        },
        res,
        (error) => {
          throw error;
        },
      );
    },
  );

  assert.deepEqual(listQuery.where, {
    action: "CREATE",
    entity_type: "Items",
    actor_id: 9,
    description: { contains: "laptop", mode: "insensitive" },
  });
  assert.deepEqual(countQuery, { where: listQuery.where });
  assert.equal(listQuery.skip, 20);
  assert.equal(listQuery.take, 10);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data, {
    logs,
    pagination: {
      total: 21,
      page: 3,
      limit: 10,
      totalPages: 3,
    },
  });
});
