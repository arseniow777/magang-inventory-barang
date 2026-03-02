import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/audit.js";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendError(res, "Username dan password wajib diisi", 400);
    }

    const user = await prisma.users.findUnique({ where: { username } });

    if (!user || !user.is_active) {
      return sendError(res, "Akun tidak ditemukan atau tidak aktif", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return sendError(res, "Password salah", 401);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    await createAuditLog({
      actor_id: user.id,
      actor_role: user.role,
      action: "LOGIN",
      entity_type: "Users",
      entity_id: user.id,
      description: `${user.username} login ke sistem`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Login berhasil", {
      token,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        username: user.username,
        name: user.name,
        role: user.role,
        telegram_id: user.telegram_id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        employee_id: true,
        username: true,
        name: true,
        role: true,
        phone_number: true,
        telegram_id: true,
        is_active: true,
        created_at: true,
      },
    });

    if (!user) {
      return sendError(res, "User tidak ditemukan", 404);
    }

    return sendSuccess(res, "Data user berhasil diambil", user);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "LOGOUT",
      entity_type: "Users",
      entity_id: req.user.id,
      description: `${req.user.username} logout dari sistem`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Logout berhasil");
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { username, new_password } = req.body;

    if (!username || !new_password) {
      return sendError(res, "Username dan password baru wajib diisi", 400);
    }

    const user = await prisma.users.findUnique({ where: { username } });

    if (!user) {
      return sendError(res, "Username tidak ditemukan", 404);
    }

    if (!user.is_active) {
      return sendError(res, "Akun tidak aktif", 403);
    }

    const existingPending = await prisma.passwordResets.findFirst({
      where: { user_id: user.id, status: "pending" },
    });

    if (existingPending) {
      return sendError(
        res,
        "Anda sudah memiliki request reset password yang masih pending",
        400,
      );
    }

    const new_password_hash = await bcrypt.hash(new_password, 10);

    const reset = await prisma.passwordResets.create({
      data: { user_id: user.id, new_password_hash, status: "pending" },
    });

    const admins = await prisma.users.findMany({ where: { role: "admin" } });

    await Promise.all(
      admins.map((admin) =>
        prisma.notifications.create({
          data: {
            user_id: admin.id,
            message: `${user.name} (${user.username}) mengajukan reset password`,
            type: "password",
          },
        }),
      ),
    );

    await createAuditLog({
      actor_id: user.id,
      actor_role: user.role,
      action: "RESET_PASSWORD_REQUEST",
      entity_type: "PasswordResets",
      entity_id: reset.id,
      description: `${user.username} mengajukan reset password via website`,
    });

    return sendSuccess(
      res,
      "Request reset password berhasil diajukan. Tunggu approval dari admin.",
    );
  } catch (err) {
    next(err);
  }
};
