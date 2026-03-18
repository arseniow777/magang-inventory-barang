# AI Engineering Analysis

> Built by: **Ferdian** (Frontend Developer & AI Engineer)
> Project: Inventory Management System with AI-Powered Telegram Bot

---

## Quick Reference

| Spec            | Value                                            |
| --------------- | ------------------------------------------------ |
| **Base Model**  | FunctionGemma 270M (270 million parameters)      |
| **Fine-tuning** | QLoRA (4-bit quantization)                       |
| **Accuracy**    | 88.45% mean_token_accuracy                       |
| **Dataset**     | 300 samples (235 train / 65 eval)                |
| **Deployment**  | HuggingFace Spaces (Dockerized FastAPI)          |
| **Integration** | Telegram Bot → Node.js → AI Service → PostgreSQL |

---

## 1. Model & Fine-tuning

### Base Model

**FunctionGemma 270M** — A 270 million parameter model designed for function calling.

```
Source: docs/src/content/docs/overview/timeline.mdx:211-212
"menyusun dataset 300 sampel JSONL untuk FunctionGemma 270M"
"Fine-tuning FunctionGemma 270M dengan QLoRA (mean_token_accuracy 88,45%)"
```

### Fine-tuning Method

**QLoRA (Quantized Low-Rank Adaptation)**

| Parameter      | Value     | Status                       |
| -------------- | --------- | ---------------------------- |
| Quantization   | **4-bit** | Confirmed (QLoRA definition) |
| LoRA Rank (r)  | Unknown   | Not in codebase              |
| LoRA Alpha     | Unknown   | Not in codebase              |
| Dropout        | Unknown   | Not in codebase              |
| Target Modules | Unknown   | Not in codebase              |

> **Note**: Training scripts are hosted externally on HuggingFace Spaces, not in this repository.

### Training Objective

**Function Calling / Tool Use** — The model learns to:

1. Parse natural language queries in Indonesian
2. Decide which function to call (or respond with text)
3. Extract the correct arguments (e.g., `keyword: "laptop"`)

---

## 2. Dataset

### Location

```
backend/src/dataset/
├── dataset_final.jsonl          # 300 samples (MAIN TRAINING FILE)
├── dataset.jsonl                # 142 samples (base template)
├── dataset_getItemInfo.jsonl    # 25 samples
├── dataset_getAvailableItems.jsonl
├── dataset_getItemStock.jsonl
├── dataset_getItemLocation.jsonl
├── dataset_getItemHistoryLocation.jsonl
├── dataset_getMostBorrowedItems.jsonl
├── dataset_getUserActiveLoans.jsonl
├── dataset_mixed.jsonl
├── dataset_mixed_admin.jsonl
├── dataset_mixed_member.jsonl
├── dataset_mixed_keywords.jsonl
└── dataset_mixed_ambiguous.jsonl
```

### Data Format (OpenAI-compatible)

Each sample in `dataset_final.jsonl`:

```json
{
  "metadata": "train",
  "tools": [
    {
      "function": {
        "name": "getItemInfo",
        "description": "Mencari informasi detail sebuah item di gudang...",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "keyword": {
              "type": "STRING",
              "description": "Kata kunci nama, kode model, atau kategori item"
            }
          },
          "required": ["keyword"]
        }
      }
    }
  ],
  "messages": [
    {
      "role": "developer",
      "content": "You are an inventory warehouse assistant. Answer user questions by calling the appropriate function. Only call a function when needed."
    },
    {
      "role": "user",
      "content": "Mohon informasi lengkap mengenai unit laptop yang tersedia di gudang."
    },
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [
        {
          "function": {
            "name": "getItemInfo",
            "arguments": { "keyword": "laptop" }
          }
        }
      ]
    }
  ]
}
```

### The 7 Functions

| Function                 | What It Does                                                 | Example Query                        |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| `getItemInfo`            | Search item details (name, model, category, who's borrowing) | "info laptop"                        |
| `getAvailableItems`      | Find items with status=available                             | "barang apa yang bisa dipinjam?"     |
| `getMostBorrowedItems`   | Top N most borrowed items                                    | "barang yang paling sering dipinjam" |
| `getUserActiveLoans`     | User's currently borrowed items                              | "pinjaman saya apa aja?"             |
| `getItemLocation`        | Physical location of an item                                 | "dimana lokasi proyektor?"           |
| `getItemStock`           | Stock count by status (available/borrowed/etc)               | "stok laptop ada berapa?"            |
| `getItemHistoryLocation` | Transfer/movement history                                    | "riwayat perpindahan AC"             |

### Dataset Statistics

| Metric                | Count                        |
| --------------------- | ---------------------------- |
| **Total Samples**     | 300                          |
| **Training Set**      | 235 (`"metadata": "train"`)  |
| **Evaluation Set**    | 65 (`"metadata": "eval"`)    |
| **Functions Covered** | 7                            |
| **Language**          | Indonesian only              |
| **Source**            | Manually created (synthetic) |

### Query Style Variations

The dataset includes multiple speaking styles:

```
Formal:    "Mohon informasi lengkap mengenai unit laptop yang tersedia"
Casual:    "eh cek dong info tripod, yang mana aja yang masih oke"
Slang:     "bro detail scanner dong, kondisinya masih bagus ga"
Direct:    "laptop ada berapa?"
```

---

## 3. Model Performance

### Training Metrics

| Metric                  | Value      | Source             |
| ----------------------- | ---------- | ------------------ |
| **mean_token_accuracy** | **88.45%** | `timeline.mdx:212` |

### Evaluation

- **Test Set**: 65 samples with `"metadata": "eval"` marker
- **Inference Examples**: Not in codebase (external HuggingFace)

---

## 4. Deployment Architecture

### Where It Runs

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────┐      ┌─────────────────┐      ┌───────────────┐  │
│   │ Telegram │ ───▶ │   Node.js API   │ ───▶ │  HuggingFace  │  │
│   │   User   │      │   (Railway)     │      │    Spaces     │  │
│   └──────────┘      └────────┬────────┘      └───────────────┘  │
│                              │                       │           │
│                              │ ◀─────────────────────┘           │
│                              │   { type, calls/text }            │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │ inventoryFunctions │                        │
│                    │   (Prisma ORM)  │                          │
│                    └────────┬────────┘                          │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │   PostgreSQL    │                          │
│                    │    (Neon DB)    │                          │
│                    └─────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoint

**URL**: `https://ferdiannf-inventel-ai-service.hf.space/predict`

**Request** (from `inventoryQueryHandler.js:34-38`):

```javascript
const response = await fetch(`${AI_SERVICE_URL}/predict`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message, userId: userId.toString() }),
  signal: AbortSignal.timeout(30000), // 30 second timeout
});
```

**Response Types**:

```typescript
// Type 1: Text Response (NO_FUNCTION_CALL)
// Used for greetings, thanks, out-of-scope queries
{
  type: "text",
  text: "Halo! Saya asisten inventory gudang. Ada yang bisa saya bantu?"
}

// Type 2: Function Call
// Used when model detects inventory query intent
{
  type: "function_call",
  calls: [{
    name: "getItemStock",
    arguments: { keyword: "laptop" }
  }]
}
```

### Complete Request Flow

```
1. User sends message to Telegram bot
   └─▶ "laptop ada berapa yang tersedia?"

2. telegramBot.js:622 routes to AI handler
   └─▶ handleInventoryQuery(text, user.id)

3. inventoryQueryHandler.js:34 calls HuggingFace
   └─▶ POST /predict { message, userId }

4. AI Service returns function call
   └─▶ { type: "function_call", calls: [{name: "getItemStock", arguments: {keyword: "laptop"}}] }

5. inventoryQueryHandler.js:64 executes database function
   └─▶ executeFunction("getItemStock", {keyword: "laptop"}, userId)

6. inventoryFunctions.js queries PostgreSQL via Prisma
   └─▶ SELECT * FROM item_units WHERE item.name LIKE '%laptop%'

7. inventoryQueryHandler.js:117 formats response
   └─▶ formatResponse("getItemStock", data)

8. Telegram bot sends formatted Markdown
   └─▶ "📦 *Stok: laptop*\n\nTotal: 5 unit\n\nRincian:\n  • available: 3 unit\n  • borrowed: 2 unit"
```

---

## 5. Code Implementation

### AI Handler (`inventoryQueryHandler.js`)

```javascript
// backend/src/utils/inventoryQueryHandler.js

export const handleInventoryQuery = async (message, userId) => {
  // 1. Call AI service
  const response = await fetch(`${AI_SERVICE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, userId: userId.toString() }),
    signal: AbortSignal.timeout(30000),
  });

  const result = await response.json();

  // 2. Handle text response (NO_FUNCTION_CALL)
  if (result.type === "text") {
    return result.text || "Maaf, saya tidak mengerti pertanyaan Anda.";
  }

  // 3. Handle function call
  if (result.type === "function_call" && result.calls?.length > 0) {
    const call = result.calls[0]; // Only first call is processed!
    const data = await executeFunction(call.name, call.arguments, userId);
    return formatResponse(call.name, data);
  }

  return "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.";
};
```

### Telegram Bot Integration (`telegramBot.js:621-648`)

```javascript
// backend/src/utils/telegramBot.js

bot.on("message", async (msg) => {
  // ... validation code ...

  // All non-command messages go to AI
  await bot.sendChatAction(chatId, "typing");

  try {
    const aiResponse = await handleInventoryQuery(text, user.id);

    // Graceful fallback if AI service is down
    if (aiResponse === null) {
      await bot.sendMessage(
        chatId,
        `Fitur pencarian AI sedang tidak aktif.\n\nGunakan menu di bawah ini:`,
        { parse_mode: "Markdown", reply_markup: getMenu() },
      );
      return;
    }

    await bot.sendMessage(chatId, aiResponse, { parse_mode: "Markdown" });
  } catch (aiError) {
    console.error("Bot AI handler error:", aiError.message);
    await bot.sendMessage(
      chatId,
      "Maaf, terjadi kesalahan saat memproses pertanyaan kamu. Coba lagi nanti.",
    );
  }
});
```

### Database Functions (`inventoryFunctions.js`)

Example implementation:

```javascript
// backend/src/utils/inventoryFunctions.js

export async function getItemStock(keyword) {
  const units = await prisma.itemUnits.findMany({
    where: {
      OR: [
        { item: { name: { contains: keyword, mode: "insensitive" } } },
        { item: { category: { contains: keyword, mode: "insensitive" } } },
      ],
    },
    select: { status: true, item: { select: { name: true } } },
  });

  if (units.length === 0) {
    return { found: false, message: `Tidak ada data untuk "${keyword}".` };
  }

  const summary = units.reduce((acc, u) => {
    acc[u.status] = (acc[u.status] || 0) + 1;
    return acc;
  }, {});

  return { found: true, keyword, total: units.length, breakdown: summary };
}
```

---

## 6. The Problem Being Solved

### Before AI (Menu-Based Only)

Users had to click through inline keyboard buttons:

```javascript
// telegramBot.js:16-28
const getMenu = () => ({
  inline_keyboard: [
    [{ text: "Profil Saya", callback_data: "menu_profile" }],
    [{ text: "Request Terakhir", callback_data: "menu_requests" }],
    [{ text: "Berita Acara Terakhir", callback_data: "menu_reports" }],
    [{ text: "Return Barang", callback_data: "menu_return" }],
    // ... more buttons
  ],
});
```

**Pain Points**:

- No text search capability
- Multiple clicks to find information
- Cannot ask custom questions

### After AI (Natural Language)

Users type naturally:

| User Types                           | AI Does                              |
| ------------------------------------ | ------------------------------------ |
| "laptop ada berapa?"                 | Calls `getItemStock("laptop")`       |
| "dimana lokasi proyektor?"           | Calls `getItemLocation("proyektor")` |
| "siapa yang minjem AC?"              | Calls `getItemInfo("AC")`            |
| "barang yang paling sering dipinjam" | Calls `getMostBorrowedItems(5)`      |
| "pinjaman saya apa aja?"             | Calls `getUserActiveLoans(userId)`   |

### Graceful Degradation

When AI service is offline (HuggingFace down, timeout, etc.):

```javascript
if (aiResponse === null) {
  await bot.sendMessage(
    chatId,
    `Fitur pencarian AI sedang tidak aktif.\n\nGunakan menu di bawah ini:`,
    { reply_markup: getMenu() },
  );
}
```

Users fall back to menu-based navigation. **System remains functional.**

---

## 7. Limitations & Failure Cases

| Limitation                | Impact                                    | Code Evidence                                      |
| ------------------------- | ----------------------------------------- | -------------------------------------------------- |
| **7 functions only**      | Cannot add items, approve requests, etc.  | `inventoryQueryHandler.js:88-113` switch statement |
| **Indonesian only**       | English queries may fail                  | All dataset samples in Indonesian                  |
| **30-second timeout**     | Slow inference = failure                  | `signal: AbortSignal.timeout(30000)`               |
| **Stateless**             | No conversation memory                    | Each call independent                              |
| **Single function/query** | Only `result.calls[0]` processed          | `inventoryQueryHandler.js:60`                      |
| **Keyword extraction**    | "laptop asus" → "laptop" may be too broad | Depends on model training                          |
| **No write operations**   | Read-only queries                         | All 7 functions are SELECT-only                    |

---

## 8. Key File Locations

| Component           | Path                                          |
| ------------------- | --------------------------------------------- |
| AI Handler          | `backend/src/utils/inventoryQueryHandler.js`  |
| Database Functions  | `backend/src/utils/inventoryFunctions.js`     |
| Telegram Bot        | `backend/src/utils/telegramBot.js`            |
| Training Dataset    | `backend/src/dataset/dataset_final.jsonl`     |
| All Datasets        | `backend/src/dataset/`                        |
| Timeline (Evidence) | `docs/src/content/docs/overview/timeline.mdx` |

---

## 9. What's NOT in This Repository

The following are hosted externally on **HuggingFace Spaces**:

| Component                                     | Status   |
| --------------------------------------------- | -------- |
| Training script (fine-tuning code)            | External |
| `adapter_config.json` (LoRA hyperparameters)  | External |
| FastAPI inference server (`app.py`)           | External |
| Dockerfile                                    | External |
| Model weights (FunctionGemma + LoRA adapters) | External |

**External Repository**: `https://huggingface.co/spaces/ferdiannf/inventel-ai-service`

---

## 10. Development Timeline

From `docs/src/content/docs/overview/timeline.mdx`:

| Date              | Activity                                               |
| ----------------- | ------------------------------------------------------ |
| **March 5, 2026** | Dataset creation (300 JSONL samples)                   |
| **March 5, 2026** | Fine-tuning FunctionGemma with QLoRA (88.45% accuracy) |
| **March 5, 2026** | FastAPI endpoint development                           |
| **March 6, 2026** | Docker containerization                                |
| **March 6, 2026** | Deploy to HuggingFace Spaces                           |
| **March 6, 2026** | Integration with Telegram bot                          |
| **March 6, 2026** | Production testing                                     |
