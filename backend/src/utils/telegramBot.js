import TelegramBot from 'node-telegram-bot-api';
import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { createAuditLog } from './audit.js';

const bot = process.env.TELEGRAM_BOT_TOKEN 
  ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
  : null;

if (bot) {
  bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegram_id = msg.from.id.toString();
    const param = match[1].trim();

    if (param) {
      try {
        const decoded = Buffer.from(param, 'base64').toString();
        
        if (decoded.startsWith('link:')) {
          const user_id = parseInt(decoded.split(':')[1]);
          const user = await prisma.users.findUnique({ where: { id: user_id } });

          if (!user) {
            await bot.sendMessage(chatId, 'User tidak ditemukan');
            return;
          }

          if (user.telegram_id && user.telegram_id !== telegram_id) {
            await bot.sendMessage(chatId, 'Akun ini sudah terhubung dengan Telegram lain');
            return;
          }

          await prisma.users.update({
            where: { id: user.id },
            data: { telegram_id }
          });

          await bot.sendMessage(
            chatId,
            `✅ Akun ${user.username} berhasil terhubung!\n\nAnda akan menerima notifikasi untuk:\n- Approval request\n- Status berita acara\n- Reset password`
          );
          return;
        }
      } catch (error) {
        console.error('Deep link error:', error);
      }
    }

    await bot.sendMessage(
      chatId,
      `Selamat datang di InveTel Bot!\n\nUntuk reset password, kirim pesan dengan format:\nusername|passwordbaru\n\nContoh:\nadmin|Password123`
    );
  });

  bot.on('message', async (msg) => {
    if (msg.text && msg.text.startsWith('/')) return;

    const telegram_id = msg.from.id.toString();
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.includes('|')) {
      await bot.sendMessage(chatId, 'Format salah! Gunakan format:\nusername|passwordbaru');
      return;
    }

    const [username, new_password] = text.split('|').map(s => s.trim());

    if (!username || !new_password) {
      await bot.sendMessage(chatId, 'Username dan password tidak boleh kosong');
      return;
    }

    try {
      const user = await prisma.users.findUnique({ where: { username } });

      if (!user) {
        await bot.sendMessage(chatId, 'Username tidak ditemukan');
        return;
      }

      if (user.telegram_id && user.telegram_id !== telegram_id) {
        await bot.sendMessage(chatId, 'Username ini sudah terdaftar dengan Telegram lain');
        return;
      }

      if (!user.telegram_id) {
        await prisma.users.update({
          where: { id: user.id },
          data: { telegram_id }
        });
      }

      const existingPending = await prisma.passwordResets.findFirst({
        where: {
          user_id: user.id,
          status: 'pending'
        }
      });

      if (existingPending) {
        await bot.sendMessage(chatId, 'Anda sudah memiliki request reset password yang masih pending');
        return;
      }

      const new_password_hash = await bcrypt.hash(new_password, 10);

      const reset = await prisma.passwordResets.create({
        data: {
          user_id: user.id,
          new_password_hash,
          status: 'pending'
        }
      });

      const admins = await prisma.users.findMany({ where: { role: 'admin' } });

      await Promise.all(
        admins.map(admin =>
          prisma.notifications.create({
            data: {
              user_id: admin.id,
              message: `${user.name} (${user.username}) mengajukan reset password`,
              status: 'pending'
            }
          })
        )
      );

      await createAuditLog({
        actor_id: user.id,
        actor_role: user.role,
        action: "RESET_PASSWORD_REQUEST",
        entity_type: "PasswordResets",
        entity_id: reset.id,
        description: `${user.username} mengajukan reset password via Telegram`
      });

      await bot.sendMessage(chatId, 'Request reset password berhasil diajukan! Tunggu approval dari admin.');
    } catch (error) {
      console.error('Bot error:', error);
      await bot.sendMessage(chatId, 'Terjadi kesalahan, coba lagi nanti');
    }
  });

  console.log('Telegram bot started');
}

export const sendTelegramMessage = async (telegram_id, message) => {
  if (!bot) return { success: false, error: 'Bot not configured' };
  if (!telegram_id) return { success: false, error: 'No telegram_id' };

  try {
    await bot.sendMessage(telegram_id, message);
    return { success: true };
  } catch (error) {
    console.error('Telegram send error:', error.message);
    return { success: false, error: error.message };
  }
};

export default bot;
