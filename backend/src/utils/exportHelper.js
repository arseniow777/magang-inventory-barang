// src/utils/exportHelper.js
import ExcelJS from 'exceljs';
import prisma from '../config/prisma.js';

export const generateExcelAuditLogs = async (filters) => {
  const where = buildWhereClause(filters);
  
  console.log('WHERE CLAUSE:', JSON.stringify(where, null, 2));
  
  const logs = await prisma.auditLogs.findMany({
    where,
    include: { actor: true },
    orderBy: { created_at: 'desc' }
  });

  console.log('LOGS FOUND:', logs.length);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Audit Logs');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Timestamp', key: 'created_at', width: 20 },
    { header: 'Actor', key: 'actor', width: 20 },
    { header: 'Role', key: 'role', width: 10 },
    { header: 'Action', key: 'action', width: 15 },
    { header: 'Entity Type', key: 'entity_type', width: 15 },
    { header: 'Entity ID', key: 'entity_id', width: 10 },
    { header: 'Description', key: 'description', width: 50 }
  ];

  logs.forEach(log => {
    worksheet.addRow({
      id: log.id,
      created_at: log.created_at.toISOString(),
      actor: log.actor.name,
      role: log.actor_role,
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id,
      description: log.description || ''
    });
  });

  worksheet.getRow(1).font = { bold: true };
  
  return workbook;
};

const buildWhereClause = (filters) => {
  const where = {};
  
  if (filters.action) where.action = filters.action;
  if (filters.entity_type) where.entity_type = filters.entity_type;
  if (filters.actor_id) where.actor_id = parseInt(filters.actor_id);
  
  if (filters.start_date || filters.end_date) {
    where.created_at = {};
    if (filters.start_date) {
      const startDateTime = new Date(filters.start_date);
      startDateTime.setHours(0, 0, 0, 0);
      where.created_at.gte = startDateTime;
    }
    if (filters.end_date) {
      const endDateTime = new Date(filters.end_date);
      endDateTime.setHours(23, 59, 59, 999);
      where.created_at.lte = endDateTime;
    }
  }
  
  if (filters.search) {
    where.description = {
      contains: filters.search,
      mode: 'insensitive'
    };
  }
  
  return where;
};