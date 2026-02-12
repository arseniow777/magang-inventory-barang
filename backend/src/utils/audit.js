import prisma from "../config/prisma.js";

export const createAuditLog = async ({ actor_id, actor_role, action, entity_type, entity_id, description, user_agent }) => {
  await prisma.auditLogs.create({
    data: {
      actor_id,
      actor_role,
      action,
      entity_type,
      entity_id,
      description: description || null,
      user_agent: user_agent || null,
    },
  });
};