import TelegramBot from 'node-telegram-bot-api';
import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { createAuditLog } from './audit.js';

const bot = process.env.TELEGRAM_BOT_TOKEN
  ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
  : null;

const API_URL = process.env.API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.WEB_URL || 'http://localhost:5173';

const getMenu = () => ({
  inline_keyboard: [
    [{ text: 'Profil Saya', callback_data: 'menu_profile' }],
    [
      { text: 'Request Terakhir', callback_data: 'menu_requests' },
      { text: 'Berita Acara Terakhir', callback_data: 'menu_reports' }
    ],
    [{ text: 'Return Barang', callback_data: 'menu_return' }],
    [{ text: 'Ganti Password', callback_data: 'menu_reset_password' }],
    [{ text: 'Hubungi Admin', callback_data: 'menu_contact_admin' }],
    // [{ text: 'Buka Website', url: `${FRONTEND_URL}/dashboard` }]
  ]
});

const getUserByTelegramId = async (telegram_id) => {
  return await prisma.users.findFirst({ where: { telegram_id } });
};

const sendNotConnected = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Akun Telegram Anda belum terhubung.\n\nSilakan login ke website dan generate link koneksi melalui menu profil.\n\nJika ingin reset password, kirim pesan dengan format:\n\`username|passwordbaru\``,
    { parse_mode: 'Markdown' }
  );
};

const sendMainMenu = async (chatId, name) => {
  await bot.sendMessage(
    chatId,
    `Halo, *${name}*! Pilih menu yang tersedia:`,
    { parse_mode: 'Markdown', reply_markup: getMenu() }
  );
};

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
            await bot.sendMessage(chatId, 'User tidak ditemukan.');
            return;
          }

          if (user.telegram_id && user.telegram_id !== telegram_id) {
            await bot.sendMessage(chatId, 'Akun ini sudah terhubung dengan Telegram lain.');
            return;
          }

          const alreadyUsed = await prisma.users.findFirst({
            where: {
              telegram_id,
              id: { not: user.id }
            }
          });

          if (alreadyUsed) {
            await bot.sendMessage(chatId, 'Telegram ini sudah terhubung dengan akun lain.');
            return;
          }

          await prisma.users.update({
            where: { id: user.id },
            data: { telegram_id }
          });

          await bot.sendMessage(
            chatId,
            `Akun *${user.username}* berhasil terhubung dengan Telegram.\n\nPilih menu yang tersedia:`,
            { parse_mode: 'Markdown', reply_markup: getMenu() }
          );
          return;
        }
      } catch (error) {
        console.error('Deep link error:', error);
      }
    }

    const user = await getUserByTelegramId(telegram_id);
    if (user) {
      await sendMainMenu(chatId, user.name);
    } else {
      await sendNotConnected(chatId);
    }
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const telegram_id = query.from.id.toString();
    const data = query.data;

    try {
      const user = await getUserByTelegramId(telegram_id);

      if (!user) {
        await bot.answerCallbackQuery(query.id);
        await sendNotConnected(chatId);
        return;
      }

      if (data === 'menu_profile') {
        await bot.sendMessage(
          chatId,
          `*Profil Saya*\n\nNama: ${user.name}\nUsername: ${user.username}\nEmployee ID: ${user.employee_id}\nRole: ${user.role.toUpperCase()}\nNo. HP: ${user.phone_number || '-'}`,
          { parse_mode: 'Markdown' }
        );
      }

      if (data === 'menu_requests') {
        const request = await prisma.requests.findFirst({
          where: { pic_id: user.id },
          include: {
            destination_location: true,
            _count: { select: { request_items: true } }
          },
          orderBy: { created_at: 'desc' }
        });

        if (!request) {
          await bot.sendMessage(chatId, 'Belum ada riwayat pengajuan.');
        } else {
          const statusLabel = {
            pending: 'Menunggu',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            completed: 'Selesai'
          };
          await bot.sendMessage(
            chatId,
            `*Request Terakhir*\n\nKode: ${request.request_code}\nTipe: ${request.request_type.toUpperCase()}\nStatus: ${statusLabel[request.status] || request.status}\nJumlah Item: ${request._count.request_items}\nTanggal: ${new Date(request.created_at).toLocaleDateString('id-ID')}`,
            { parse_mode: 'Markdown' }
          );
        }
      }

      if (data === 'menu_reports') {
        const report = await prisma.officialReports.findFirst({
          where: {
            request: { pic_id: user.id },
            is_approved: true
          },
          orderBy: { issued_date: 'desc' }
        });

        if (!report) {
          await bot.sendMessage(chatId, 'Belum ada riwayat berita acara.');
        } else {
          const pdfResponse = await fetch(`${API_URL}/api/v1/bot/reports/${report.id}/download`);

          if (!pdfResponse.ok) {
            await bot.sendMessage(chatId, 'Gagal mengambil file PDF.');
          } else {
            const arrayBuffer = await pdfResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            await bot.sendDocument(
              chatId,
              buffer,
              { caption: `Berita Acara ${report.report_number}\nTanggal: ${new Date(report.issued_date).toLocaleDateString('id-ID')}` },
              { filename: `${report.report_number}.pdf`, contentType: 'application/pdf' }
            );
          }
        }
      }

      if (data === 'menu_return') {
        const borrowRequest = await prisma.requests.findFirst({
          where: {
            pic_id: user.id,
            request_type: 'borrow',
            status: 'approved',
            returned_at: null
          },
          include: {
            destination_location: true,
            _count: { select: { request_items: true } }
          },
          orderBy: { created_at: 'desc' }
        });

        if (!borrowRequest) {
          await bot.sendMessage(chatId, 'Tidak ada barang yang perlu dikembalikan.');
        } else {
          const locations = await prisma.locations.findMany();

          const locationButtons = locations.map(loc => ([{
            text: `${loc.building_name} Lt.${loc.floor}`,
            callback_data: `return_confirm:${borrowRequest.id}:${loc.id}`
          }]));

          await bot.sendMessage(
            chatId,
            `*Return Barang*\n\nKode: ${borrowRequest.request_code}\nJumlah Item: ${borrowRequest._count.request_items}\nTujuan: ${borrowRequest.destination_location?.building_name || '-'}\n\nPilih lokasi pengembalian:`,
            { parse_mode: 'Markdown', reply_markup: { inline_keyboard: locationButtons } }
          );
        }
      }

      if (data.startsWith('return_confirm:')) {
        const [, requestId, locationId] = data.split(':');

        const request = await prisma.requests.findUnique({
          where: { id: parseInt(requestId) },
          include: {
            request_items: {
              include: {
                unit: { include: { location: true } }
              }
            }
          }
        });

        if (!request) {
          await bot.sendMessage(chatId, 'Request tidak ditemukan.');
        } else if (request.pic_id !== user.id) {
          await bot.sendMessage(chatId, 'Anda tidak memiliki akses ke request ini.');
        } else if (request.request_type !== 'borrow' || request.status !== 'approved' || request.returned_at) {
          await bot.sendMessage(chatId, 'Request tidak valid untuk dikembalikan.');
        } else {
          const location = await prisma.locations.findUnique({
            where: { id: parseInt(locationId) }
          });

          if (!location) {
            await bot.sendMessage(chatId, 'Lokasi tidak ditemukan.');
          } else {
            for (const requestItem of request.request_items) {
              await prisma.itemUnits.update({
                where: { id: requestItem.unit_id },
                data: {
                  status: 'available',
                  location_id: parseInt(locationId)
                }
              });

              await prisma.itemLogHistory.create({
                data: {
                  unit_id: requestItem.unit_id,
                  from_location_id: requestItem.unit.location_id,
                  to_location_id: parseInt(locationId),
                  request_id: request.id,
                  moved_by_id: user.id
                }
              });
            }

            await prisma.requests.update({
              where: { id: parseInt(requestId) },
              data: {
                status: 'completed',
                returned_at: new Date(),
                return_location_id: parseInt(locationId),
                returned_by_id: user.id
              }
            });

            await createAuditLog({
              actor_id: user.id,
              actor_role: user.role,
              action: 'UPDATE',
              entity_type: 'Requests',
              entity_id: request.id,
              description: `${user.username} melakukan return request ${request.request_code} via Telegram`
            });

            const admins = await prisma.users.findMany({ where: { role: 'admin' } });

            await Promise.all(
              admins.map(admin =>
                prisma.notifications.create({
                  data: {
                    user_id: admin.id,
                    message: `${user.name} mengembalikan barang dari request ${request.request_code} via Telegram`,
                    type: 'request',
                  }
                })
              )
            );

            await bot.sendMessage(
              chatId,
              `Barang dari request ${request.request_code} berhasil dikembalikan ke ${location.building_name} Lt.${location.floor}.`
            );
          }
        }
      }

      if (data === 'menu_reset_password') {
        await bot.sendMessage(
          chatId,
          `*Reset Password*\n\nKirim pesan dengan format:\n\`username|passwordbaru\`\n\nContoh:\n\`${user.username}|Password123\``,
          { parse_mode: 'Markdown' }
        );
      }

      if (data === 'menu_contact_admin') {
        await bot.sendMessage(
          chatId,
          `*Hubungi Admin*\n\nKirim pesan dengan format:\n\`/contact pesan Anda\`\n\nContoh:\n\`/contact Saya butuh bantuan untuk request barang\``,
          { parse_mode: 'Markdown' }
        );
      }

      await bot.answerCallbackQuery(query.id);
    } catch (error) {
      console.error('Callback query error:', error);
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, 'Terjadi kesalahan, coba lagi nanti.');
    }
  });

  bot.onText(/\/contact (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegram_id = msg.from.id.toString();
    const message = match[1];

    const user = await getUserByTelegramId(telegram_id);
    if (!user) {
      await sendNotConnected(chatId);
      return;
    }

    try {
      const admins = await prisma.users.findMany({ where: { role: 'admin' } });

      await Promise.all(
        admins.map(admin =>
          prisma.notifications.create({
            data: {
              user_id: admin.id,
              message: `Pesan dari ${user.name} (${user.username}): ${message}`,
              type: 'system'
            }
          })
        )
      );

      await bot.sendMessage(chatId, 'Pesan berhasil dikirim ke admin.');
    } catch (error) {
      console.error('Contact admin error:', error);
      await bot.sendMessage(chatId, 'Terjadi kesalahan, coba lagi nanti.');
    }
  });

  bot.on('message', async (msg) => {
    if (!msg.text) return;
    if (msg.text.startsWith('/')) return;

    const chatId = msg.chat.id;
    const telegram_id = msg.from.id.toString();
    const text = msg.text.trim();

    // Cek format reset password
    if (text.includes('|')) {
      const [username, new_password] = text.split('|').map(s => s.trim());

      if (!username || !new_password) {
        await bot.sendMessage(chatId, 'Format salah. Gunakan: `username|passwordbaru`', { parse_mode: 'Markdown' });
        return;
      }

      try {
        const targetUser = await prisma.users.findUnique({ where: { username } });

        if (!targetUser) {
          await bot.sendMessage(chatId, 'Username tidak ditemukan.');
          return;
        }

        if (targetUser.telegram_id && targetUser.telegram_id !== telegram_id) {
          await bot.sendMessage(chatId, 'Username ini sudah terdaftar dengan Telegram lain.');
          return;
        }

        const existingPending = await prisma.passwordResets.findFirst({
          where: { user_id: targetUser.id, status: 'pending' }
        });

        if (existingPending) {
          await bot.sendMessage(chatId, 'Anda sudah memiliki request reset password yang masih pending.');
          return;
        }

        const new_password_hash = await bcrypt.hash(new_password, 10);

        const reset = await prisma.passwordResets.create({
          data: {
            user_id: targetUser.id,
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
                message: `${targetUser.name} (${targetUser.username}) mengajukan reset password`,
                type: 'password'
              }
            })
          )
        );

        await createAuditLog({
          actor_id: targetUser.id,
          actor_role: targetUser.role,
          action: 'RESET_PASSWORD_REQUEST',
          entity_type: 'PasswordResets',
          entity_id: reset.id,
          description: `${targetUser.username} mengajukan reset password via Telegram`
        });

        await bot.sendMessage(chatId, 'Request reset password berhasil diajukan. Tunggu approval dari admin.');
      } catch (error) {
        console.error('Reset password error:', error);
        await bot.sendMessage(chatId, 'Terjadi kesalahan, coba lagi nanti.');
      }

      return;
    }

    const user = await getUserByTelegramId(telegram_id);
    if (user) {
      await sendMainMenu(chatId, user.name);
    } else {
      await sendNotConnected(chatId);
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