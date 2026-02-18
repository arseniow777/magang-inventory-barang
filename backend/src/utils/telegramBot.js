import TelegramBot from 'node-telegram-bot-api';
import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { createAuditLog } from './audit.js';

const bot = process.env.TELEGRAM_BOT_TOKEN 
  ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
  : null;

const webUrl = process.env.WEB_URL || 'https://your-website.com';

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
            await bot.sendMessage(chatId, '❌ User tidak ditemukan');
            return;
          }

          if (user.telegram_id && user.telegram_id !== telegram_id) {
            await bot.sendMessage(chatId, '❌ Akun ini sudah terhubung dengan Telegram lain');
            return;
          }

          await prisma.users.update({
            where: { id: user.id },
            data: { telegram_id }
          });

          const keyboard = {
            inline_keyboard: [
              [{ text: '🌐 Buka Website', url: `${webUrl}/dashboard` }],
              [
                { text: '👤 Profil Saya', callback_data: 'menu_profile' },
                { text: '📦 Riwayat Pengajuan', callback_data: 'menu_requests' }
              ],
              [
                { text: '📄 Unduh Dokumen', callback_data: 'menu_reports' },
                { text: '🔐 Ganti Password', callback_data: 'menu_reset_password' }
              ],
              [
                { text: '💬 Hubungi Admin', callback_data: 'menu_contact_admin' }
              ]
            ]
          };

          await bot.sendMessage(
            chatId,
            `🎉 *Selamat datang di Layanan Notifikasi InvenTel*\n\nAkun dengan username *${user.username}* telah berhasil terhubung dengan sistem Telegram kami.\n\nMulai saat ini, bot ini akan berfungsi sebagai asisten digital Anda dalam mengirimkan notifikasi real-time terkait:\n\n✅ Status pengajuan inventaris (Request)\n📄 Penerbitan dokumen Berita Acara\n🔐 Reset Password\n\nAnda kini dapat menutup aplikasi Telegram dan kembali melanjutkan aktivitas di platform utama kami.\n\n────────────────────\n📋 *Menu Layanan:*`,
            { parse_mode: 'Markdown', reply_markup: keyboard }
          );
          return;
        }
      } catch (error) {
        console.error('Deep link error:', error);
      }
    }

    await bot.sendMessage(
      chatId,
      `🤖 *Selamat datang di InveTel Bot!*\n\nUntuk menghubungkan akun Anda dengan Telegram, silakan generate link melalui website.\n\nUntuk reset password, kirim pesan dengan format:\n\`username|passwordbaru\`\n\nContoh:\n\`admin|Password123\``,
      { parse_mode: 'Markdown' }
    );
  });

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const telegram_id = query.from.id.toString();
  const data = query.data;

  try {
    if (data === 'menu_profile') {
      // GANTI INI:
      const response = await fetch(`http://localhost:5000/api/v1/bot/user/${telegram_id}`);
      const result = await response.json();

      if (result.success) {
        const user = result.data;
        await bot.sendMessage(
          chatId,
          `👤 *Profil Anda*\n\n*Nama:* ${user.name}\n*Username:* ${user.username}\n*Employee ID:* ${user.employee_id}\n*Role:* ${user.role.toUpperCase()}\n*Phone:* ${user.phone_number || '-'}`,
          { parse_mode: 'Markdown' }
        );
      } else {
        await bot.sendMessage(chatId, '❌ Data profil tidak ditemukan');
      }
    }

    if (data === 'menu_requests') {
      // GANTI INI:
      const response = await fetch(`http://localhost:5000/api/v1/bot/requests/${telegram_id}`);
      const result = await response.json();

      if (result.success) {
        const req = result.data;
        const statusEmoji = {
          pending: '⏳',
          approved: '✅',
          rejected: '❌',
          completed: '✔️'
        };
        await bot.sendMessage(
          chatId,
          `📦 *Request Terbaru*\n\n*Kode:* ${req.request_code}\n*Tipe:* ${req.request_type.toUpperCase()}\n*Status:* ${statusEmoji[req.status]} ${req.status.toUpperCase()}\n*Jumlah Item:* ${req._count.request_items}\n*Tanggal:* ${new Date(req.created_at).toLocaleDateString('id-ID')}`,
          { parse_mode: 'Markdown' }
        );
      } else {
        await bot.sendMessage(chatId, '📭 Belum ada request');
      }
    }

    if (data === 'menu_reports') {
      // GANTI INI:
      const response = await fetch(`http://localhost:5000/api/v1/bot/reports/${telegram_id}`);
      const result = await response.json();

      if (result.success) {
        const report = result.data;
        const downloadUrl = `${webUrl}/reports/${report.id}/download`;
        const keyboard = {
          inline_keyboard: [[{ text: '📥 Download PDF', url: downloadUrl }]]
        };
        await bot.sendMessage(
          chatId,
          `📄 *Berita Acara Terbaru*\n\n*Nomor:* ${report.report_number}\n*Tipe:* ${report.report_type.toUpperCase()}\n*Tanggal:* ${new Date(report.issued_date).toLocaleDateString('id-ID')}\n*Status:* ✅ Approved`,
          { parse_mode: 'Markdown', reply_markup: keyboard }
        );
      } else {
        await bot.sendMessage(chatId, '📭 Belum ada berita acara');
      }
    }

    if (data === 'menu_reset_password') {
      await bot.sendMessage(
        chatId,
        `🔐 *Reset Password*\n\nUntuk mereset password, kirim pesan dengan format:\n\`username|passwordbaru\`\n\nContoh:\n\`admin|Password123\`\n\nPassword baru akan diproses setelah admin menyetujui.`,
        { parse_mode: 'Markdown' }
      );
    }

    if (data === 'menu_contact_admin') {
      await bot.sendMessage(
        chatId,
        `💬 *Hubungi Admin*\n\nKirim pesan Anda dalam format:\n\`/contact Pesan Anda di sini\`\n\nContoh:\n\`/contact Saya butuh bantuan untuk request barang\``,
        { parse_mode: 'Markdown' }
      );
    }

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error('Callback query error:', error);
    await bot.sendMessage(chatId, '❌ Terjadi kesalahan, coba lagi nanti');
    await bot.answerCallbackQuery(query.id);
  }
});

  bot.onText(/\/contact (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegram_id = msg.from.id.toString();
    const message = match[1];

    try {
      const response = await fetch(`http://localhost:${process.env.PORT || 3000}/api/bot/contact-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_id, message })
      });

      const result = await response.json();

      if (result.success) {
        await bot.sendMessage(chatId, '✅ Pesan berhasil dikirim ke admin');
      } else {
        await bot.sendMessage(chatId, '❌ Gagal mengirim pesan');
      }
    } catch (error) {
      console.error('Contact admin error:', error);
      await bot.sendMessage(chatId, '❌ Terjadi kesalahan');
    }
  });

  bot.on('message', async (msg) => {
    if (msg.text && (msg.text.startsWith('/') || msg.text.startsWith('menu_'))) return;

    const telegram_id = msg.from.id.toString();
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.includes('|')) {
      await bot.sendMessage(chatId, '❌ Format salah! Gunakan format:\n`username|passwordbaru`', { parse_mode: 'Markdown' });
      return;
    }

    const [username, new_password] = text.split('|').map(s => s.trim());

    if (!username || !new_password) {
      await bot.sendMessage(chatId, '❌ Username dan password tidak boleh kosong');
      return;
    }

    try {
      const user = await prisma.users.findUnique({ where: { username } });

      if (!user) {
        await bot.sendMessage(chatId, '❌ Username tidak ditemukan');
        return;
      }

      if (user.telegram_id && user.telegram_id !== telegram_id) {
        await bot.sendMessage(chatId, '❌ Username ini sudah terdaftar dengan Telegram lain');
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
        await bot.sendMessage(chatId, '⚠️ Anda sudah memiliki request reset password yang masih pending');
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
              type: 'password',
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

      await bot.sendMessage(chatId, '✅ Request reset password berhasil diajukan! Tunggu approval dari admin.');
    } catch (error) {
      console.error('Bot error:', error);
      await bot.sendMessage(chatId, '❌ Terjadi kesalahan, coba lagi nanti');
    }
  });

  console.log('Telegram bot started');
}

export const sendTelegramMessage = async (telegram_id, message) => {
  if (!bot) return { success: false, error: 'Bot not configured' };
  if (!telegram_id) return { success: false, error: 'No telegram_id' };

  try {
    await bot.sendMessage(telegram_id, message, { parse_mode: 'Markdown' });
    return { success: true };
  } catch (error) {
    console.error('Telegram send error:', error.message);
    return { success: false, error: error.message };
  }
};

export default bot;