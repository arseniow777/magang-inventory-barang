import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/audit.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
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

    return sendSuccess(res, "Data users berhasil diambil", users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
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

export const createUser = async (req, res, next) => {
  try {
    const { employee_id, username, name, role, phone_number, telegram_id, password } = req.body;

    if (!employee_id || !username || !name || !password) {
      return sendError(res, "employee_id, username, name, dan password wajib diisi", 400);
    }

    const existing = await prisma.users.findFirst({
      where: { OR: [{ username }, { employee_id }] },
    });

    if (existing) {
      return sendError(res, "Username atau employee_id sudah digunakan", 400);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        employee_id,
        username,
        name,
        role: role || "pic",
        phone_number: phone_number || null,
        telegram_id: telegram_id || null,
        password_hash,
      },
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "CREATE",
      entity_type: "Users",
      entity_id: user.id,
      description: `Akun ${user.username} dibuat oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Akun berhasil dibuat", {
      id: user.id,
      employee_id: user.employee_id,
      username: user.username,
      name: user.name,
      role: user.role,
    }, 201);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone_number, telegram_id, role, is_active, password } = req.body;

    const existing = await prisma.users.findUnique({ where: { id: parseInt(id) } });

    if (!existing) {
      return sendError(res, "User tidak ditemukan", 404);
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (telegram_id !== undefined) updateData.telegram_id = telegram_id;
    if (role) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (password) updateData.password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "UPDATE",
      entity_type: "Users",
      entity_id: user.id,
      description: `Akun ${user.username} diupdate oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Akun berhasil diupdate");
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.users.findUnique({ where: { id: parseInt(id) } });

    if (!existing) {
      return sendError(res, "User tidak ditemukan", 404);
    }

    if (existing.id === req.user.id) {
      return sendError(res, "Tidak bisa menonaktifkan akun sendiri", 400);
    }

    await prisma.users.update({
      where: { id: parseInt(id) },
      data: { is_active: false },
    });

    await createAuditLog({
      actor_id: req.user.id,
      actor_role: req.user.role,
      action: "ARCHIVE",
      entity_type: "Users",
      entity_id: existing.id,
      description: `Akun ${existing.username} dinonaktifkan oleh ${req.user.username}`,
      user_agent: req.headers["user-agent"],
    });

    return sendSuccess(res, "Akun berhasil dinonaktifkan");
  } catch (err) {
    next(err);
  }
};