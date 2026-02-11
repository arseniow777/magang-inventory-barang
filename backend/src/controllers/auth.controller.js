import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";

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
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return sendSuccess(res, "Login berhasil", {
      token,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        username: user.username,
        name: user.name,
        role: user.role,
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