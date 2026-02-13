import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/audit.js";
import { sendTelegramMessage } from "../utils/telegramBot.js";

export const getPasswordResets = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const resets = await prisma.passwordResets.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            employee_id: true
          }
        },
        admin: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return sendSuccess(res, "Data password resets berhasil diambil", resets);
  } catch (err) {
    next(err);
  }
};

export const approvePasswordReset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reset = await prisma.passwordResets.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });

    if (!reset) {
      return sendError(res, "Password reset tidak ditemukan", 404);
    }

    if (reset.status !== 'pending') {
      return sendError(res, "Password reset sudah diproses", 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { id: reset.user_id },
        data: { password_hash: reset.new_password_hash }
      });

      await tx.passwordResets.update({
        where: { id: parseInt(id) },
        data: {
          status: 'approved',
          admin_id: req.user.id,
          approved_at: new Date()
        }
      });
    });

    if (reset.user.telegram_id) {
      await sendTelegramMessage(
        reset.user.telegram_id,
        `✅ Password Anda telah berhasil direset oleh admin.\n\nSilakan login dengan password baru Anda.`
      );
    }

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "APPROVE",
      entity_type: "PasswordResets",
      entity_id: reset.id,
      description: `Admin ${req.user.username} menyetujui reset password untuk ${reset.user.username}`,
      user_agent: req.headers["user-agent"]
    });

    return sendSuccess(res, "Password reset berhasil disetujui");
  } catch (err) {
    next(err);
  }
};

export const rejectPasswordReset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reset = await prisma.passwordResets.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });

    if (!reset) {
      return sendError(res, "Password reset tidak ditemukan", 404);
    }

    if (reset.status !== 'pending') {
      return sendError(res, "Password reset sudah diproses", 400);
    }

    await prisma.passwordResets.update({
      where: { id: parseInt(id) },
      data: {
        status: 'rejected',
        admin_id: req.user.id
      }
    });

    if (reset.user.telegram_id) {
      await sendTelegramMessage(
        reset.user.telegram_id,
        `❌ Request reset password Anda ditolak oleh admin.\n\nSilakan hubungi admin untuk informasi lebih lanjut.`
      );
    }

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "REJECT",
      entity_type: "PasswordResets",
      entity_id: reset.id,
      description: `Admin ${req.user.username} menolak reset password untuk ${reset.user.username}`,
      user_agent: req.headers["user-agent"]
    });

    return sendSuccess(res, "Password reset berhasil ditolak");
  } catch (err) {
    next(err);
  }
};