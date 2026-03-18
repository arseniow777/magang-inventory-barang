Ini adalah hasil analisis codebase Inventel oleh GitHub Copilot.
Aku adalah mahasiswa Teknik Informatika UDINUS yang mengerjakan posisi
Frontend Developer & AI Engineer selama KP.

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

# Frontend Analysis: React + TypeScript Inventory Management System

Built by: Ferdian

## 1. Problem & User

### Target Users

Based on `/front/src/features/auth/types/auth.types.ts:1-2`:

- **Admin** (`role: "admin"`) - Full system access
- **PIC (Person in Charge)** (`role: "pic"`) - Limited access, can create requests and transfers

### Core User Problems Solved

Based on codebase analysis:

1. **Inventory Tracking & Management**
   - Browse and search items (barang) with photos, categories, procurement year
   - Track individual units with QR codes, condition (good/damaged/broken), status (available/borrowed/transferred/sold/demolished)
   - View unit location history and audit logs

2. **Request Management (Permintaan)**
   - PICs can request items (borrow or transfer)
   - Admins can approve/reject/track requests
   - Support for in-transit status and return workflows

3. **User & Location Management**
   - Admin management of users and locations
   - Location tracking per building with floor and address

4. **Audit & Compliance**
   - Complete audit log system tracking all actions
   - Berita Acara (official reports) for item activities
   - Password reset requests for security

5. **Real-time Notifications**
   - Telegram bot integration for instant notifications
   - Web-based notification system

### Without This Application

Users would have to:

- Manually track inventory with spreadsheets or paper
- Use physical forms for borrowing/transfer requests
- Manually coordinate approvals via email/messaging
- No QR code tracking for quick item identification
- No audit trail for accountability
- No real-time status updates on requests

---

## 2. Technical Complexity

### Most Technically Complex Part

**QR Code + Telegram Integration Flow**

- Location: `/front/src/features/auth/components/TelegramConfirm.tsx:203-489`
- Complexity: Real-time polling for connection status, QR generation, multi-state UI

The TelegramConfirm component implements:

1. Generate Telegram deep link via API (`/users/telegram/generate-link`)
2. Display QR code using `qrcode.react` library
3. **Polling mechanism** (line 245-260): Automatically checks every 3 seconds if user has linked Telegram account
4. Three states: unlinked → showing QR → linked

```typescript
// Polling implementation
useEffect(() => {
  if (telegramLink && !isLinked) {
    pollingRef.current = setInterval(async () => {
      await refetch();
    }, 3000);
  } else {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }
  return () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
  };
}, [telegramLink, isLinked]);
```

### Data Fetching and Synchronization

**Using TanStack Query (React Query)**

Example from `/front/src/features/barang/hooks/useBarangItems.ts:1-20`:

```typescript
export function useBarangItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => itemsMasterAPI.getItems(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
  });
}
```

**Mutation Pattern** from `/front/src/features/auth/hooks/useLogin.ts:1-26`:

```typescript
export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // clear old data and guest flag
      queryClient.clear();
      localStorage.removeItem("isGuest");
      localStorage.setItem("token", data.token);
      if (!data.user?.telegram_id) {
        navigate(ROUTES.TELEGRAM_CONFIRM);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    },
  });
}
```

**Multi-step mutation with file upload** from `/front/src/features/barang/hooks/useCreateBarang.ts:11-29`:

```typescript
export function useCreateBarang() {
  return useMutation({
    mutationFn: async (data: {
      barangData: CreateBarangRequest;
      files: File[];
    }) => {
      // Create item first
      const itemResponse = await createBarangAPI.createItem(data.barangData);

      // Upload photos if present
      if (data.files.length > 0) {
        await createBarangAPI.uploadPhotos(itemResponse.id, data.files);
      }

      return itemResponse;
    },
  });
}
```

### QR Code Feature End-to-End

**Generation**: QR codes are generated client-side using `qrcode.react`

**Storage**: QR code value is the unit code stored in database

**Display** from `/front/src/features/barang/components/unit-detail/UnitInfoPanel.tsx:62-74`:

```typescript
{qrValue && (
  <div className="grid grid-cols-2 items-start gap-4 lg:flex lg:flex-col">
    <div className="text-sm font-medium lg:hidden">QR Code</div>
    <div className="flex flex-col items-start lg:items-start">
      <div className="h-auto aspect-square rounded-xs border p-2 bg-white flex items-center justify-center">
        <QRCodeSVG value={qrValue} className="w-auto h-auto" />
      </div>
      <p className="text-[10px] text-muted-foreground font-mono mt-1.5">
        {unit?.unit_code ?? ""}
      </p>
    </div>
  </div>
)}
```

**Scanning Flow**: Not found in frontend codebase - likely handled by Telegram bot or mobile scanner

### Real-time Features

**Polling-based** (not WebSocket):

1. **Telegram Connection Status** - 3-second polling interval (shown above)

2. **Notifications** from `/front/src/features/notifikasi/hooks/useNotifications.ts:5-11`:

```typescript
export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: () => notifikasiAPI.getNotifications(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
```

- Uses standard React Query refetch with 5-minute stale time
- No real-time WebSocket connection found

---

## 3. Architecture Decisions

### Folder Structure under `src/`

```
src/
├── features/          # Feature-based architecture
│   ├── auth/          # Authentication & authorization
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── schemas/   # Zod validation
│   │   └── types/
│   ├── barang/        # Items/inventory
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── create-ui/
│   │   │   ├── edit-dialog/
│   │   │   ├── image-gallery/
│   │   │   ├── item-detail/
│   │   │   └── unit-detail/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── schemas/
│   │   └── types/
│   ├── akun/          # User profile
│   ├── audit/         # Audit logs
│   ├── bantuan/       # Help/contact admin
│   ├── beranda/       # Dashboard/home
│   ├── berita/        # News/reports
│   ├── dashboard/     # Main dashboard layout
│   ├── lokasi/        # Locations
│   ├── notifikasi/    # Notifications
│   ├── pengguna/      # User management
│   ├── permintaan/    # Requests
│   └── transfer/      # Transfer requests
├── components/        # Shared components
│   ├── ui/            # shadcn/ui components
│   ├── patterns/      # Reusable patterns
│   └── reui/          # Custom reusable UI
├── lib/               # Utilities
├── hooks/             # Shared hooks
├── config/            # Configuration
└── constants/         # Constants (routes, etc.)
```

### Why Feature-Based Architecture?

Evidence from structure:

- Each feature is self-contained with its own API, hooks, components, schemas, types
- Promotes modularity and maintainability
- Clear separation of concerns
- Easy to locate and modify feature-specific code

From `/front/src/features/barang/` example:

```
barang/
├── api/              # API calls
├── components/       # Feature-specific UI
│   ├── create-ui/
│   ├── edit-dialog/
│   ├── image-gallery/
│   ├── item-detail/
│   └── unit-detail/
├── hooks/            # Feature-specific hooks
├── pages/            # Feature routes
├── schemas/          # Zod validation schemas
└── types/            # TypeScript types
```

### Form Validation with Zod

From `/front/src/features/barang/schemas/barang.schema.ts:12-27`:

```typescript
export const createItemMastersSchema = z.object({
  name: z.string().min(1, "Nama barang harus diisi"),
  model_code: z.string().min(1, "Kode model harus diisi"),
  category: z.string().min(1, "Kategori harus diisi"),
  procurement_year: z.number().int().min(1900, "Tahun tidak valid"),
});

export const updateItemMastersSchema = z.object({
  name: z.string().min(1, "Nama barang harus diisi").optional(),
  model_code: z.string().min(1, "Kode model harus diisi").optional(),
  category: z.string().min(1, "Kategori harus diisi").optional(),
  procurement_year: z.number().int().min(1900, "Tahun tidak valid").optional(),
});
```

Enum validation from `/front/src/features/barang/schemas/barang.schema.ts:30-37`:

```typescript
export const itemConditionEnum = z.enum(["good", "damaged", "broken"]);
export const itemStatusEnum = z.enum([
  "available",
  "borrowed",
  "transferred",
  "sold",
  "demolished",
]);
```

Login validation from `/front/src/features/auth/schemas/auth.schema.ts:3-6`:

```typescript
export const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(5, "Password minimal 8 karakter"),
});
```

### Backend API Communication

**Base Configuration** from `/front/src/lib/api.ts:1-2`:

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";
```

**Authentication Headers** from `/front/src/lib/api.ts:10-22`:

```typescript
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
```

**Error Handling** from `/front/src/lib/api.ts:24-36`:

```typescript
const body = await response.json().catch(() => ({}) as ApiResponse<T>);

if (response.status === 401) {
  localStorage.removeItem("token");
  window.location.replace("/login");
  throw new Error("Sesi berakhir");
}

if (!response.ok) {
  throw new Error(
    body.message ?? `Request failed with status ${response.status}`,
  );
}
```

**API Client Methods** from `/front/src/lib/api.ts:41-83`:

```typescript
export const apiClient = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),

  /** Use for multipart/form-data uploads — omits Content-Type so the browser sets it with the boundary. */
  postForm: <T>(url: string, data: FormData) => {
    const token = localStorage.getItem("token");
    return fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: data,
    }).then((res) =>
      res
        .json()
        .catch(() => ({}) as { success: boolean; message: string; data: T })
        .then((body) => {
          if (!res.ok)
            throw new Error(
              body.message ?? `Request failed with status ${res.status}`,
            );
          return body.data as T;
        }),
    );
  },
};
```

---

## 4. UI Component Patterns

### shadcn/ui Components Used

From `/front/package.json:12-40` and `/front/src/components/ui/`:

**Most Heavily Used:**

- Button
- Dialog
- Card
- Table (for data tables)
- Input/Textarea/Select (forms)
- Badge (status indicators)
- Separator
- Sidebar
- Dropdown Menu
- Alert Dialog
- Skeleton (loading states)
- Spinner (loading indicator)
- Sonner (toast notifications)

**Additional Components:**

- Tabs
- Tooltip
- Calendar
- Breadcrumb
- Sheet
- Avatar
- Accordion
- Collapsible
- Progress
- Chart (recharts integration)
- Combobox
- Field (custom form field wrapper)

### Custom Components Built on shadcn/ui

1. **Field Components** (`/front/src/components/ui/field.tsx`)
   - FieldGroup, FieldDescription, FieldSeparator
   - Custom form field wrappers

2. **Empty State** (`/front/src/components/empty-state.tsx`)
   - Reusable empty state component

3. **Custom Badge Variants** (`/front/src/components/reui/badge.tsx`, `/front/src/components/reui/alert.tsx`)
   - Extended badge styles

4. **File Upload Pattern** (`/front/src/components/patterns/p-file-upload-5.tsx`)
   - Custom file upload component

5. **TransferCartBadge** (from dashboard imports)
   - Shopping cart-style badge for transfer requests

### Loading/Error State Handling

**Pattern 1: Skeleton Loading** from `/front/src/features/beranda/components/KondisiBarang.tsx:70-72`:

```typescript
{isLoading ? (
  <Skeleton className="h-full" />
) : (
  // render content
)}
```

**Pattern 2: Spinner Loading** from grepped results:

```typescript
{isLoading ? (
  <div className="flex items-center justify-center py-10">
    <Spinner />
  </div>
) : (
  // render content
)}
```

**Pattern 3: Table Loading** - data tables show skeleton rows

**Pattern 4: Button Loading State** from `/front/src/features/lokasi/components/EditLokasi.tsx:133-136`:

```typescript
<Button disabled={isPending}>
  {isPending ? "Menyimpan..." : "Simpan"}
</Button>
```

**Pattern 5: Mutation Loading** - Uses `isPending` from TanStack Query mutations

**Error Handling**: Not extensively shown in grepped code - likely handled by toast notifications (Sonner) at mutation level

---

## 5. Integration Points

### AI/Bot Results Display

**Contact Admin Feature** from `/front/src/features/bantuan/api/bantuan.api.ts:3-5`:

```typescript
export const bantuanAPI = {
  contactAdmin: (message: string) =>
    apiClient.post<void>("/notifications/contact-admin/web", { message }),
};
```

This sends messages to admin via Telegram bot (inferred from endpoint name).

**Telegram Bot Integration:**

- Users link accounts via QR code/deep link
- Bot sends notifications for requests, password resets, reports
- Frontend polls for connection status
- Frontend does NOT display bot command results directly
- Bot operates server-side with Telegram API

**Real-time Updates:**

- No direct WebSocket connection
- Uses React Query's automatic refetching with staleTime
- Telegram notifications handled by bot, not displayed in frontend

### API Endpoints Consumed

**Authentication:**

- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

**Items (Barang):**

- `GET /items` - List all items
- `GET /items/:id` - Get item detail
- `POST /items` - Create item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item
- `POST /items/:id/photos` - Upload photo
- `DELETE /items/:id/photos/:photoId` - Delete photo
- `POST /items/:id/restock` - Restock item
- `GET /items/condition-summary` - Get condition stats

**Item Units:**

- `GET /item-units` - List all units
- `GET /item-units/:id` - Get unit detail
- `POST /item-units` - Create unit
- `PUT /item-units/:id` - Update unit
- `DELETE /item-units/:id` - Delete unit
- `GET /item-units?status=:status` - Filter by status

**Requests (Permintaan):**

- `GET /requests` - List requests (with query params)
- `GET /requests/my-requests` - Get own requests (PIC)
- `GET /requests/:id` - Get request detail
- `POST /requests` - Create request
- `PUT /requests/:id/approve` - Approve request
- `PUT /requests/:id/reject` - Reject request
- `PUT /requests/:id/cancel` - Cancel request
- `PUT /requests/:id/confirm-arrival` - Confirm arrival
- `PUT /requests/:id/return` - Return borrowed items

**Users (Pengguna):**

- `GET /users` - List users
- `GET /users/:id` - Get user detail
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/telegram/generate-link` - Generate Telegram link

**Locations (Lokasi):**

- `GET /locations` - List locations
- `GET /locations/:id` - Get location detail
- `POST /locations` - Create location
- `PUT /locations/:id` - Update location
- `DELETE /locations/:id` - Delete location

**Audit Logs:**

- `GET /audit-logs` - List audit logs (with query params)
- `GET /audit-logs/:id` - Get audit log detail
- `GET /audit-logs/export` - Export audit logs

**Notifications:**

- `GET /notifications` - List notifications
- `GET /notifications/:id` - Get notification detail
- `DELETE /notifications/:id` - Delete notification
- `POST /notifications/contact-admin/web` - Contact admin

**Password Resets:**

- (Inferred from feature structure, API file at `/front/src/features/permintaan/api/passwordReset.api.ts`)

---

## Summary

This is a comprehensive inventory management system with:

- **Role-based access control** (Admin vs PIC)
- **QR code tracking** for physical items
- **Request/approval workflows** for borrowing and transfers
- **Telegram bot integration** for real-time notifications
- **Audit logging** for compliance
- **Feature-based architecture** for maintainability
- **Type-safe forms** with Zod validation
- **Optimistic UI updates** with TanStack Query
- **Modern React patterns** (hooks, context, composition)

The frontend is well-structured, type-safe, and follows React best practices with clear separation of concerns.

Berdasarkan realita sistem di atas, bantu aku:

1. **Rumuskan 3 opsi judul laporan KP** yang:
   - Mencerminkan kontribusi utama (AI engineering lebih dominan)
   - Sesuai standar judul laporan KP/skripsi Informatika Indonesia
   - Spesifik (sebutkan metode, model, atau domain yang digunakan)
   - Tidak terlalu generik ("Sistem Informasi Inventaris")
     dan tidak terlalu teknis ("QLoRA r=16 alpha=32...")

2. **Rumuskan 2–3 Rumusan Masalah** yang:
   - Muncul dari masalah nyata yang teridentifikasi di sistem
   - Bisa dijawab oleh kontribusi Ferdian (frontend + AI)
   - Ditulis dalam format pertanyaan ilmiah
   - Jumlahnya sesuai dengan tujuan yang bisa dicapai

3. **Identifikasi novelty/kebaruan** laporan ini:
   - Apa yang membedakan dari laporan KP biasa?
   - Aspek teknis mana yang paling layak ditonjolkan?

Berikan alasan untuk setiap opsi.
