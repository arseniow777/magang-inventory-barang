// inventoryQueryHandler.js
import {
  getItemInfo,
  getAvailableItems,
  getMostBorrowedItems,
  getUserActiveLoans,
  getItemLocation,
  getItemStock,
  getItemHistoryLocation,
} from "./inventoryFunctions.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://ferdiannf-inventel-ai-service.hf.space";

/**
 * Kirim pesan user ke AI service, eksekusi function call yang dikembalikan,
 * lalu return hasil sebagai string untuk dikirim ke Telegram.
 *
 * @param {string} message - Pesan user dari Telegram
 * @param {string} userId  - ID user dari database (bukan telegram_id)
 * @returns {string|null}  - Teks balasan, atau null kalau AI service tidak bisa diakses
 */
export const handleInventoryQuery = async (message, userId) => {
  try {
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`📩 [INCOMING] User: ${userId}`);
    console.log(`💬 Message: "${message}"`);
    console.log(`⏰ Time: ${new Date().toLocaleString('id-ID')}`);
    console.log('═'.repeat(50));

    // 1. Kirim ke AI service
    console.log(`🔄 [AI REQUEST] POST ${AI_SERVICE_URL}/predict`);
    const response = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userId: userId.toString() }),
      signal: AbortSignal.timeout(30000), // timeout 30 detik
    });

    if (!response.ok) {
      console.error("AI service error:", response.status);
      return null;
    }

    const result = await response.json();
    console.log(`✅ [AI RESPONSE] Type: ${result.type}`);
    console.log(`📋 [AI RESPONSE] Data:`, JSON.stringify(result, null, 2));

    // 2. Kalau model jawab teks biasa (NO_FUNCTION_CALL)
    if (result.type === "text") {
      console.log(`💬 [RESULT] Teks biasa (NO_FUNCTION_CALL)`);
      const reply = result.text || "Maaf, saya tidak mengerti pertanyaan Anda.";
      console.log(`📤 [REPLY] ${reply.substring(0, 100)}...`);
      return reply;
    }

    // 3. Kalau model panggil fungsi
    if (result.type === "function_call" && result.calls?.length > 0) {
      const call = result.calls[0];
      const { name, arguments: args } = call;

      console.log(`⚡ [FUNCTION CALL] ${name}(${JSON.stringify(args)})`);
      const data = await executeFunction(name, args, userId);
      console.log(`📊 [DB RESULT] ${name}:`, JSON.stringify(data, null, 2).substring(0, 300));
      const reply = formatResponse(name, data);
      console.log(`📤 [REPLY] ${reply.substring(0, 150)}...`);
      return reply;
    }

    return "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.";

  } catch (err) {
    // Timeout atau AI service tidak bisa diakses
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      console.error("❌ [TIMEOUT] AI service tidak merespons dalam 30 detik");
      return null;
    }
    console.error(`❌ [ERROR] handleInventoryQuery: ${err.message}`);
    return null;
  }
};

// ── Eksekusi fungsi DB sesuai nama yang dipanggil model ──────────────────────
async function executeFunction(name, args, userId) {
  switch (name) {
    case "getItemInfo":
      return await getItemInfo(args.keyword);

    case "getAvailableItems":
      return await getAvailableItems(args.keyword || "");

    case "getMostBorrowedItems":
      return await getMostBorrowedItems(parseInt(args.limit) || 5);

    case "getUserActiveLoans":
      // Pakai userId dari session, bukan dari args — lebih aman
      return await getUserActiveLoans(userId);

    case "getItemLocation":
      return await getItemLocation(args.keyword);

    case "getItemStock":
      return await getItemStock(args.keyword);

    case "getItemHistoryLocation":
      return await getItemHistoryLocation(args.keyword || "");

    default:
      return null;
  }
}

// ── Format hasil DB jadi teks Markdown untuk Telegram ────────────────────────
function formatResponse(functionName, data) {
  if (!data) return "Maaf, data tidak ditemukan.";
  if (data.error) return `❌ ${data.error}`;
  if (!data.found) return `ℹ️ ${data.message || "Data tidak ditemukan."}`;

  switch (functionName) {

    case "getItemInfo": {
      return data.items.map((item) => {
        const unitLines = item.units.map((u) => {
          const picInfo = u.pic
            ? `\n      └ Dipinjam oleh: ${u.pic.name} (${u.pic.request_code})`
            : "";
          return `  • ${u.unit_code} — ${u.status} | ${u.condition} | ${u.location}${picInfo}`;
        }).join("\n");

        return (
          `📦 *${item.name}* (${item.model_code})\n` +
          `Kategori: ${item.category}\n` +
          `Total unit: ${item.total_units}\n` +
          `PIC: ${item.pic_master || "-"}\n` +
          `Unit:\n${unitLines}`
        );
      }).join("\n\n");
    }

    case "getAvailableItems": {
      const lines = data.items.map((item) =>
        `  • *${item.name}* (${item.category}) — ${item.count} unit tersedia\n    Lokasi: ${item.locations.join(", ") || "-"}`
      ).join("\n");
      return `✅ *Item Tersedia* (${data.total} unit)\n\n${lines}`;
    }

    case "getMostBorrowedItems": {
      const lines = data.items.map((item, i) =>
        `${i + 1}. *${item.name}* (${item.category}) — ${item.count}x dipinjam`
      ).join("\n");
      return `📊 *Item Paling Sering Dipinjam*\n\n${lines}`;
    }

    case "getUserActiveLoans": {
      const lines = data.loans.map((loan) => {
        const items = loan.items.map((i) =>
          `    • ${i.name} (${i.unit_code}) — ${i.location}`
        ).join("\n");
        return `📋 *${loan.request_code}* — ${loan.status}\n${items}`;
      }).join("\n\n");
      return `🔖 *Pinjaman Aktif Anda*\n\n${lines}`;
    }

    case "getItemLocation": {
      const lines = data.items.map((item) =>
        `  • *${item.name}* (${item.unit_code})\n    📍 ${item.location}\n    Status: ${item.status} | ${item.condition}`
      ).join("\n\n");
      return `📍 *Lokasi Barang*\n\n${lines}`;
    }

    case "getItemStock": {
      const breakdown = Object.entries(data.breakdown)
        .map(([status, count]) => `  • ${status}: ${count} unit`)
        .join("\n");
      return (
        `📦 *Stok: ${data.keyword}*\n\n` +
        `Total: ${data.total} unit\n\n` +
        `Rincian:\n${breakdown}`
      );
    }

    case "getItemHistoryLocation": {
      const lines = data.history.map((log) =>
        `  • *${log.unit_code}* — ${log.item_name}\n    ${log.from} → ${log.to}\n    Oleh: ${log.moved_by} | ${new Date(log.moved_at).toLocaleDateString("id-ID")}`
      ).join("\n\n");
      return `🗂️ *Riwayat Perpindahan* (${data.total} log)\n\n${lines}`;
    }

    default:
      return "Data berhasil diambil.";
  }
}