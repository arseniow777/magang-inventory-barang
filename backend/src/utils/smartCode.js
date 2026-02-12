import prisma from "../config/prisma.js";

export const generateModelCode = async (category, procurementYear) => {
  const categoryShort = category.substring(0, 3).toUpperCase();
  const yearStr = procurementYear.toString();
  const baseCode = `${categoryShort}${yearStr}`;

  const lastItem = await prisma.items.findFirst({
    where: {
      model_code: {
        startsWith: baseCode,
      },
    },
    orderBy: {
      model_code: "desc",
    },
  });

  let nextNumber = 1;
  if (lastItem) {
    const lastNumber = parseInt(lastItem.model_code.slice(-3));
    nextNumber = lastNumber + 1;
  }

  return `${baseCode}${nextNumber.toString().padStart(3, "0")}`;
};

export const generateUnitCode = async (itemId) => {
  const item = await prisma.items.findUnique({
    where: { id: itemId },
    select: { model_code: true },
  });

  if (!item) throw new Error("Item not found");

  const lastUnit = await prisma.itemUnits.findFirst({
    where: { item_id: itemId },
    orderBy: { unit_code: "desc" },
  });

  let nextNumber = 1;
  if (lastUnit) {
    const lastNumber = parseInt(lastUnit.unit_code.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  return `${item.model_code}-${nextNumber.toString().padStart(3, "0")}`;
};

export const generateMultipleUnitCodes = async (itemId, quantity) => {
  const item = await prisma.items.findUnique({
    where: { id: itemId },
    select: { model_code: true },
  });

  if (!item) throw new Error("Item not found");

  const lastUnit = await prisma.itemUnits.findFirst({
    where: { item_id: itemId },
    orderBy: { unit_code: "desc" },
  });

  let startNumber = 1;
  if (lastUnit) {
    const lastNumber = parseInt(lastUnit.unit_code.split("-")[1]);
    startNumber = lastNumber + 1;
  }

  const codes = [];
  for (let i = 0; i < quantity; i++) {
    codes.push(`${item.model_code}-${(startNumber + i).toString().padStart(3, "0")}`);
  }

  return codes;
};

export const generateRequestCode = async () => {
  const year = new Date().getFullYear();
  const baseCode = `REQ${year}`;

  const lastRequest = await prisma.requests.findFirst({
    where: {
      request_code: {
        startsWith: baseCode,
      },
    },
    orderBy: {
      request_code: "desc",
    },
  });

  let nextNumber = 1;
  if (lastRequest) {
    const lastNumber = parseInt(lastRequest.request_code.slice(-3));
    nextNumber = lastNumber + 1;
  }

  return `${baseCode}${nextNumber.toString().padStart(3, "0")}`;
};

export const generateReportNumber = async () => {
  const year = new Date().getFullYear();
  const baseCode = `BA${year}`;

  const lastReport = await prisma.officialReports.findFirst({
    where: {
      report_number: {
        startsWith: baseCode,
      },
    },
    orderBy: {
      report_number: "desc",
    },
  });

  let nextNumber = 1;
  if (lastReport) {
    const lastNumber = parseInt(lastReport.report_number.slice(-3));
    nextNumber = lastNumber + 1;
  }

  return `${baseCode}${nextNumber.toString().padStart(3, "0")}`;
};