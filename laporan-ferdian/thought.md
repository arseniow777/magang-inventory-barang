# Analisis Laporan KP - Inventel System

> **Analisis oleh**: Claude Opus 4.6
> **Tanggal**: 18 Maret 2026
> **Konteks**: Laporan Kerja Praktek - Frontend Developer & AI Engineer

---

## 1. Opsi Judul Laporan KP

### Opsi A (Fokus AI Engineering) ⭐ **REKOMENDASI**

**"Implementasi Fine-Tuning FunctionGemma dengan QLoRA untuk Asisten Virtual Berbasis Natural Language Processing pada Sistem Inventaris"**

**Alasan:**

- Menonjolkan kontribusi teknis utama: fine-tuning model dengan metode spesifik (QLoRA)
- Menyebutkan model konkret (FunctionGemma) yang membedakan dari laporan generik
- Domain jelas (sistem inventaris) tapi tidak terlalu sempit
- Standar judul akademis Indonesia (kata kunci: implementasi, berbasis)
- Mencerminkan dominansi AI engineering dalam kontribusi

### Opsi B (Fokus Integrasi End-to-End)

**"Pengembangan Chatbot Inventaris Berbahasa Indonesia dengan Pendekatan Function Calling menggunakan FunctionGemma pada Platform Telegram"**

**Alasan:**

- Menekankan aspek bahasa Indonesia yang menjadi keunikan dataset
- Menonjolkan platform deployment (Telegram) yang konkret
- "Function calling" adalah paradigma yang lebih modern dari klasifikasi biasa
- Cocok jika ingin menekankan aspek produk jadi, bukan riset murni
- Lebih aplikatif dan mudah dipahami pembaca non-teknis

### Opsi C (Fokus Arsitektur Full-Stack)

**"Integrasi Model Function Calling FunctionGemma dengan Antarmuka React untuk Sistem Manajemen Inventaris Berbasis Natural Language"**

**Alasan:**

- Mencerminkan kedua posisi (Frontend + AI Engineer)
- Menunjukkan kompleksitas arsitektur (AI service + frontend + bot)
- Lebih luas cakupannya, cocok jika ingin membahas frontend secara signifikan
- Risiko: bisa terkesan kurang fokus karena terlalu luas

---

## 2. Rumusan Masalah

### Rumusan Masalah 1 (Inti - AI) ⭐ **WAJIB**

**"Bagaimana mengimplementasikan fine-tuning model FunctionGemma 270M menggunakan metode QLoRA untuk mengubah query bahasa Indonesia menjadi pemanggilan fungsi inventaris dengan akurasi tinggi?"**

**Alasan:**

- Menjawab kontribusi utama: proses fine-tuning
- Terukur: akurasi 88.45% bisa jadi bukti
- Spesifik: menyebutkan model, metode, dan domain
- Core technical contribution yang membedakan dari KP biasa

**Jawaban RM1 (Preview):**

- Dataset 300 sampel JSONL format OpenAI-compatible
- QLoRA dengan 4-bit quantization
- 7 fungsi inventaris (getItemInfo, getAvailableItems, dll)
- Hasil: 88.45% mean_token_accuracy
- Training set: 235 samples, Eval set: 65 samples

### Rumusan Masalah 2 (Integrasi) ⭐ **REKOMENDASI**

**"Bagaimana mengintegrasikan layanan AI function calling dengan bot Telegram dan backend Node.js untuk menyediakan antarmuka inventaris berbasis natural language yang responsif?"**

**Alasan:**

- Menjawab kontribusi integrasi sistem (Telegram → Node.js → AI → PostgreSQL)
- Aspek "responsif" bisa diukur (timeout 30 detik, graceful degradation)
- Mencakup arsitektur deployment
- Menunjukkan pemahaman end-to-end system design

**Jawaban RM2 (Preview):**

- Deployment: HuggingFace Spaces (Docker + FastAPI)
- API endpoint: POST /predict dengan timeout 30 detik
- Response types: text (greeting) vs function_call (inventory query)
- Graceful fallback: jika AI down, user tetap bisa pakai menu
- Integration flow: Telegram → Railway (Node.js) → HuggingFace → Neon DB

### Rumusan Masalah 3 (Opsional - Dataset)

**"Bagaimana merancang dataset fine-tuning yang mencakup variasi gaya bicara pengguna Indonesia (formal, kasual, slang) untuk domain inventaris?"**

**Alasan:**

- Menunjukkan proses pembuatan 300 sampel dataset
- Keunikan: dataset Indonesian multi-style untuk domain spesifik
- Bisa dihubungkan dengan evaluasi performa model
- Opsional: gunakan jika ingin fokus pada aspek data engineering

**Jawaban RM3 (Preview):**

- 300 sampel manually created (synthetic)
- Variasi gaya: formal, kasual, slang
  - Formal: "Mohon informasi lengkap mengenai unit laptop yang tersedia"
  - Casual: "eh cek dong info tripod, yang mana aja yang masih oke"
  - Slang: "bro detail scanner dong, kondisinya masih bagus ga"
- Coverage: 7 fungsi dengan multiple variations
- Split: 235 train / 65 eval

---

## 3. Novelty/Kebaruan

### Pembeda dari Laporan KP Biasa

| Aspek           | KP Biasa                          | Laporan Ini ✨                                    |
| --------------- | --------------------------------- | ------------------------------------------------- |
| **Scope**       | CRUD web app                      | AI-powered system dengan fine-tuning model        |
| **AI**          | Pakai API ChatGPT/Gemini langsung | Fine-tuning model sendiri (FunctionGemma + QLoRA) |
| **Dataset**     | Tidak ada                         | 300 sampel JSONL buatan sendiri                   |
| **Deployment**  | Localhost/hosting biasa           | HuggingFace Spaces + Docker + Railway             |
| **NLP**         | Tidak ada / keyword matching      | Function calling paradigm                         |
| **Complexity**  | Single tech stack                 | Multi-service architecture (AI + Backend + Bot)   |
| **Performance** | N/A                               | Measured (88.45% accuracy)                        |

### Aspek Teknis yang Layak Ditonjolkan

#### 1. QLoRA Fine-Tuning pada Model Kecil **[HIGHLIGHT]**

- Membuktikan model 270M parameter bisa efektif untuk task spesifik
- Quantization 4-bit untuk efisiensi resource
- Alternatif viable dibanding pakai GPT-4/Gemini (cost + privacy)
- Production-ready dengan akurasi 88.45%

**Implikasi:**

- Cost efficiency: tidak perlu model besar
- Latency: model kecil = inference cepat
- Deployment flexibility: bisa run di environment terbatas

#### 2. Function Calling sebagai Abstraksi **[HIGHLIGHT]**

- Lebih modern dari pendekatan intent classification + NER
- Output langsung executable (nama fungsi + arguments)
- Menghindari kompleksitas rule-based parsing
- Scalable: mudah tambah fungsi baru

**Perbandingan:**

```
❌ Old approach (Intent + NER):
User: "laptop ada berapa?"
→ Intent: CHECK_STOCK
→ NER: Entity="laptop"
→ Manual mapping ke SQL query

✅ Function calling:
User: "laptop ada berapa?"
→ {name: "getItemStock", arguments: {keyword: "laptop"}}
→ Direct execution
```

#### 3. Dataset Multi-Style Indonesian **[HIGHLIGHT]**

- 300 sampel dengan variasi formal/kasual/slang
- Domain-specific (7 fungsi inventaris)
- Reproducible methodology
- Indonesian language focus (underserved compared to English)

**Value:**

- Real-world applicability: user tidak harus bicara formal
- Robust model: trained on diverse speaking styles
- Contribution to Indonesian NLP ecosystem

#### 4. Production-Ready Architecture

- Graceful degradation (fallback ke menu jika AI down)
- 30-second timeout handling
- Real deployment di HuggingFace Spaces
- Monitoring via Telegram bot

**Architecture Flow:**

```
User → Telegram Bot → Railway (Node.js) → HuggingFace AI → Neon DB
                ↓ (if AI fails)
         Menu-based fallback
```

#### 5. End-to-End Ownership **[HIGHLIGHT]**

- Dari dataset creation → training → deployment → integration
- Tidak hanya "pakai model orang lain"
- Demonstrasi full ML lifecycle

**Timeline (March 5-6, 2026):**

1. Dataset creation (300 JSONL samples)
2. Fine-tuning FunctionGemma with QLoRA (88.45% accuracy)
3. FastAPI endpoint development
4. Docker containerization
5. Deploy to HuggingFace Spaces
6. Integration with Telegram bot
7. Production testing

---

## 4. Struktur Laporan yang Disarankan

### Bab 1: Pendahuluan

- **Latar Belakang**: Masalah pencarian inventaris (sebelumnya menu-based only)
- **Rumusan Masalah**: RM1 + RM2
- **Tujuan**: Implementasi fine-tuning + integrasi sistem
- **Manfaat**: User bisa query natural language, cost-effective AI solution

### Bab 2: Landasan Teori

- Function Calling / Tool Use
- Transformer Architecture (FunctionGemma)
- QLoRA (Quantized Low-Rank Adaptation)
- Fine-tuning vs Pre-training
- REST API & Microservices Architecture

### Bab 3: Analisis & Perancangan

- **Analisis Kebutuhan**: 7 fungsi inventaris
- **Desain Dataset**: Format OpenAI-compatible, multi-style Indonesian
- **Arsitektur Sistem**: Diagram flow (Telegram → Node.js → AI → DB)
- **Desain Model**: FunctionGemma 270M + QLoRA config

### Bab 4: Implementasi

- **Dataset Preparation**: 300 samples, train/eval split
- **Model Fine-tuning**: QLoRA configuration, training process
- **API Development**: FastAPI endpoint, Docker deployment
- **Integration**: Telegram bot handler, graceful fallback

### Bab 5: Pengujian & Evaluasi

- **Model Performance**: 88.45% mean_token_accuracy
- **Functional Testing**: 7 fungsi inventaris
- **User Acceptance Testing**: Response time, accuracy on real queries
- **Failure Cases**: Timeout handling, ambiguous queries

### Bab 6: Penutup

- **Kesimpulan**: QLoRA efektif untuk fine-tuning, function calling paradigm bekerja
- **Saran**: Expand dataset, add more functions, multi-turn conversation

---

## 5. Rekomendasi Final

### Untuk Judul

**Pilih Opsi A** (Fokus AI Engineering)

**Alasan:**

- AI engineering adalah kontribusi utama dan terberat
- Fine-tuning + QLoRA adalah novelty utama
- Lebih sesuai dengan posisi "AI Engineer"
- Frontend bisa dibahas di bagian integrasi sistem

### Untuk Rumusan Masalah

**Gunakan 2 RM: RM1 + RM2**

**Alasan:**

- RM1 (fine-tuning) = core contribution
- RM2 (integrasi) = production deployment
- Dua RM cukup untuk laporan KP (tidak terlalu luas)
- RM3 (dataset) bisa dijadikan sub-bagian dari RM1

### Key Messages untuk Pembaca

1. **Technical Depth**: Tidak hanya pakai API, tapi fine-tune model sendiri
2. **Practical Impact**: System jadi bisa pakai natural language, user-friendly
3. **Cost Efficiency**: Model 270M cukup, tidak perlu GPT-4
4. **Indonesian NLP**: Kontribusi untuk bahasa Indonesia (underserved)
5. **Production Ready**: Real deployment dengan graceful degradation

---

## 6. Potensi Pertanyaan Penguji

### Q1: Kenapa tidak pakai ChatGPT/Gemini API saja?

**Jawaban:**

- Cost: fine-tuned model lebih murah untuk high-frequency queries
- Privacy: data inventaris tidak dikirim ke third-party
- Customization: model bisa dioptimasi untuk domain spesifik
- Control: tidak tergantung API eksternal (bisa self-host)

### Q2: Kenapa akurasi 88.45%, bukan 95%+?

**Jawaban:**

- Model kecil (270M parameter) vs model besar (7B+)
- Trade-off: accuracy vs inference speed & resource
- 88.45% sudah cukup untuk production (graceful fallback handle error)
- Bisa ditingkatkan dengan dataset lebih besar atau model lebih besar

### Q3: Bagaimana menangani query di luar 7 fungsi?

**Jawaban:**

- Model trained untuk respond dengan text (NO_FUNCTION_CALL)
- Contoh: greeting, thanks, chitchat → text response
- Out-of-scope query → "Maaf, saya tidak mengerti..."
- Future: expand dengan fungsi admin (create, approve, dll)

### Q4: Bagaimana jika AI service down?

**Jawaban:**

- Graceful degradation: fallback ke menu-based navigation
- System tetap functional tanpa AI
- User notified: "Fitur pencarian AI sedang tidak aktif"
- Architecture sudah handle failure cases

### Q5: Apa kontribusi frontend-mu?

**Jawaban:**

- React + TypeScript dengan feature-based architecture
- TanStack Query untuk data synchronization
- QR code integration untuk unit tracking
- Telegram confirmation flow dengan polling mechanism
- Zod validation untuk form security
- shadcn/ui untuk consistent design system

---

## Kesimpulan

**Strength Utama Laporan Ini:**

1. Technical depth: Fine-tuning dengan QLoRA
2. Novelty: Function calling untuk Indonesian language
3. End-to-end ownership: Dataset → Training → Deployment
4. Production-ready: Real deployment dengan error handling
5. Measurable results: 88.45% accuracy

**Diferensiasi:**
Bukan hanya "membuat sistem inventaris", tapi **"membuat AI-powered system dengan fine-tuning model sendiri untuk natural language interface"**.

**Pesan Inti:**

> Model kecil (270M parameter) yang di-fine-tune dengan baik bisa mengalahkan prompt engineering pada model besar untuk task domain-specific.

---

**Catatan Tambahan:**

- Pastikan dokumentasi training process di HuggingFace Space bisa diakses
- Simpan screenshot hasil inference untuk lampiran
- Dokumentasi arsitektur dengan diagram yang jelas
- Siapkan demo video untuk presentasi
