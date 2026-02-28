import { toolDeclarations, executeTool } from "./inventoryTools.js";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "functiongemma";

// ─── Intent Pre-Routing ───────────────────────────────────────────────────────
// Detect user intent from message patterns and directly invoke the right tool,
// bypassing AI tool-call unreliability on small local models.

const INTENT_PATTERNS = [
  {
    // "lokasi laptop", "di mana laptop", "laptop ada di mana"
    pattern:
      /\b(?:lokasi|dimana|di mana|letak|tempat)\b.*?([a-z0-9\s\-_]+?)(?:\?|$)|([a-z0-9\s\-_]+?)\s+(?:ada di|dimana|di mana)/i,
    tool: "getItemLocation",
    extractKeyword: (text) => {
      const m =
        text.match(/(?:lokasi|dimana|di mana|letak|tempat)\s+(.+)/i) ||
        text.match(/(.+?)\s+(?:ada di|dimana|di mana)/i);
      return m ? m[1].trim() : null;
    },
  },
  {
    // "stok laptop", "berapa laptop", "jumlah laptop"
    pattern:
      /\b(?:stok|stock|berapa|jumlah|sisa)\b.*?([a-z0-9\s\-_]+?)(?:\?|$)/i,
    tool: "getItemStock",
    extractKeyword: (text) => {
      const m = text.match(/(?:stok|stock|berapa|jumlah|sisa)\s+(.+)/i);
      return m ? m[1].replace(/\?$/, "").trim() : null;
    },
  },
  {
    // "barang tersedia", "ada apa saja", "list barang"
    pattern: /\b(?:tersedia|available|daftar barang|barang apa|ada apa)\b/i,
    tool: "getAvailableItems",
    extractKeyword: (text) => {
      const m = text.match(/(?:tersedia|available|daftar|ada)\s+(.+)/i);
      return m ? m[1].replace(/\?$/, "").trim() : null;
    },
  },
  {
    // "paling sering dipinjam", "barang populer"
    pattern:
      /\b(?:sering dipinjam|paling sering|populer|terbanyak dipinjam)\b/i,
    tool: "getMostBorrowedItems",
    extractKeyword: () => null,
  },
  {
    // "pinjaman saya", "aktif pinjam", "saya pinjam apa"
    pattern:
      /\b(?:pinjaman saya|pinjam saya|pinjaman aktif|saya pinjam|aktif pinjam)\b/i,
    tool: "getUserActiveLoans",
    extractKeyword: () => null,
  },
  {
    // "terlambat", "overdue", "belum dikembalikan"
    pattern: /\b(?:terlambat|overdue|belum dikembalikan|lewat batas)\b/i,
    tool: "getOverdueItems",
    extractKeyword: () => null,
  },
  {
    // "info laptop", "detail iMac M3", "tentang proyektor", or bare item name like "iMac M3"
    pattern:
      /\b(?:info|detail|tentang|cek|lihat)\b|^[a-z0-9][a-z0-9\s\-+.]{1,40}$/i,
    tool: "getItemInfo",
    extractKeyword: (text) => {
      const m = text.match(/(?:info|detail|tentang|cek|lihat)\s+(.+)/i);
      return m ? m[1].trim() : text.trim();
    },
  },
];

/**
 * Try to detect intent and extract tool name + args from the message.
 * Returns null if no pattern matched.
 */
const detectIntent = (text) => {
  const lower = text.toLowerCase().trim();
  for (const intent of INTENT_PATTERNS) {
    if (intent.pattern.test(lower)) {
      const keyword = intent.extractKeyword(lower);
      const args = keyword ? { keyword } : {};
      return { tool: intent.tool, args };
    }
  }
  return null;
};

const SYSTEM_MESSAGE = {
  role: "system",
  content:
    "Kamu adalah asisten inventaris yang membantu pengguna mencari informasi tentang barang, stok, lokasi, dan pinjaman. " +
    "Jawab dalam Bahasa Indonesia yang santai dan ramah. " +
    "Gunakan format Telegram Markdown (bold dengan *teks*, italic dengan _teks_). " +
    "Selalu gunakan tool yang tersedia untuk mengambil data real dari sistem. " +
    "Jika data tidak ditemukan, berikan saran yang membantu.",
};

/**
 * Send messages to Ollama — with tool declarations (for intent detection).
 */
const ollamaChat = async (messages) => {
  const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: toolDeclarations,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Ollama error: ${response.status} ${await response.text()}`,
    );
  }

  const data = await response.json();
  return data.message;
};

// ─── Result Formatters ────────────────────────────────────────────────────────
// Format tool results into human-readable Telegram Markdown directly in JS.
// This is more reliable than asking a small local model to format JSON.

const formatters = {
  getItemLocation(result) {
    if (!result.found) return `❌ ${result.message}`;
    const lines = result.items.map(
      (u) =>
        `• *${u.name}* (${u.unit_code})\n  📍 ${u.location}\n  Status: _${u.status}_ | Kondisi: _${u.condition}_`,
    );
    return `*Lokasi Barang*\n\n${lines.join("\n\n")}`;
  },

  getItemStock(result) {
    if (!result.found) return `❌ ${result.message}`;
    const breakdown = Object.entries(result.breakdown)
      .map(([status, count]) => `  • ${status}: ${count}`)
      .join("\n");
    return `*Stok "${result.keyword}"*\n\nTotal: *${result.total} unit*\n${breakdown}`;
  },

  getAvailableItems(result) {
    if (!result.found) return `❌ ${result.message}`;
    const lines = result.items.map(
      (item) =>
        `• *${item.name}* — ${item.count} unit tersedia\n  📍 ${item.locations.length ? item.locations.join(", ") : "Lokasi tidak tersedia"}`,
    );
    return `*Barang Tersedia* (${result.total} unit)\n\n${lines.join("\n\n")}`;
  },

  getMostBorrowedItems(result) {
    if (!result.found) return `❌ ${result.message}`;
    const lines = result.items.map(
      (item, i) => `${i + 1}. *${item.name}* — ${item.count}x dipinjam`,
    );
    return `*Barang Paling Sering Dipinjam*\n\n${lines.join("\n")}`;
  },

  getUserActiveLoans(result) {
    if (!result.found) return `ℹ️ ${result.message}`;
    const lines = result.loans.map((loan) => {
      const items = loan.items
        .map((i) => `    • ${i.name} (${i.unit_code}) — ${i.location}`)
        .join("\n");
      return `*${loan.request_code}* — _${loan.status}_\n${items}`;
    });
    return `*Pinjaman Aktif Kamu*\n\n${lines.join("\n\n")}`;
  },

  getOverdueItems(result) {
    if (!result.found) return `\u2139\ufe0f ${result.message}`;
    const lines = result.overdues.map((r) => {
      const items = r.items.map((name) => `    \u2022 ${name}`).join("\n");
      return `\ud83d\udc64 *${r.pic_name}* (${r.request_code})\n${items}\n  \u23f0 ${r.days_overdue} hari terlambat`;
    });
    return `*Barang Terlambat Dikembalikan*\n\n${lines.join("\n\n")}`;
  },

  getItemInfo(result) {
    if (!result.found) return `❌ ${result.message}`;
    const lines = result.items.map((item) => {
      const unitLines = item.units
        .map((u) => {
          const statusIcon =
            u.status === "available"
              ? "🟢"
              : u.status === "borrowed"
                ? "🔴"
                : "⚪";
          let line =
            `  ${statusIcon} *${u.unit_code}* — _${u.condition}_\n` +
            `    📍 ${u.location}`;
          if (u.pic) {
            line +=
              `\n    👤 *${u.pic.name}* (${u.pic.employee_id})` +
              `\n    📋 ${u.pic.request_code} | sejak ${new Date(u.pic.borrowed_since).toLocaleDateString("id-ID")}`;
          }
          return line;
        })
        .join("\n");

      return (
        `📦 *${item.name}*  \`${item.model_code}\`\n` +
        `  Kategori: ${item.category} | Tahun: ${item.procurement_year}\n` +
        `  Total: *${item.total_units} unit*\n\n` +
        unitLines
      );
    });
    return lines.join("\n\n");
  },
};

/**
 * Handle a message from a Telegram user via Ollama AI.
 * @param {string} userMessage - The message text from the user
 * @param {number|null} userId - The internal DB user ID (for personalized queries)
 * @returns {Promise<string>} - Formatted response to send back
 */
export const handleInventoryQuery = async (userMessage, userId = null) => {
  try {
    // ── Step 1: Try intent pre-routing (reliable, regex-based) ──────────────
    const intent = detectIntent(userMessage);
    if (intent) {
      const toolResult = await executeTool(intent.tool, intent.args, userId);
      const formatter = formatters[intent.tool];
      return formatter ? formatter(toolResult) : JSON.stringify(toolResult);
    }

    // ── Step 2: Fall back to AI with tool declarations ──────────────────────
    const messages = [SYSTEM_MESSAGE, { role: "user", content: userMessage }];

    const assistantMsg = await ollamaChat(messages);

    if (assistantMsg.tool_calls?.length) {
      const call = assistantMsg.tool_calls[0];
      const { name, arguments: args } = call.function;

      const toolResult = await executeTool(name, args || {}, userId);

      messages.push(assistantMsg);
      messages.push({ role: "tool", content: JSON.stringify(toolResult) });

      const finalMsg = await ollamaChat(messages);
      return finalMsg?.content || JSON.stringify(toolResult);
    }

    return assistantMsg?.content || "Maaf, tidak ada respons dari AI.";
  } catch (error) {
    console.error("AI query error:", error.message);
    return "Maaf, terjadi kesalahan saat memproses pertanyaan kamu. Coba lagi nanti.";
  }
};
