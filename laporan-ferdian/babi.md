# Konteks Laporan KP — Ferdian (UDINUS)

## Identitas

- **Nama**: Ferdian
- **Kampus**: Universitas Dian Nuswantoro (UDINUS)
- **Posisi KP**: Frontend Developer & AI Engineer (merangkap Project Manager)
- **Mitra**: PT. Telkom Indonesia (Witel Semarang), divisi SSGS (_Shared Service and General Support_)
- **Durasi KP**: 1 bulan onsite
- **Dosen Pembimbing**: Eko Hari Rachmawanto, M.Kom

---

## Judul Final

> "Implementasi Supervised Fine-Tuning FunctionGemma 270M untuk Asisten Virtual Berbasis Natural Language Processing pada Sistem Manajemen Inventaris"

---

## Data Teknis

| Item               | Nilai                                                  |
| ------------------ | ------------------------------------------------------ |
| Model              | FunctionGemma 270M                                     |
| Metode fine-tuning | Supervised Fine-Tuning (SFT)                           |
| Library            | `SFTTrainer` dari `trl`                                |
| Dataset            | 300 sampel (235 train / 65 eval)                       |
| Bahasa dataset     | Indonesia, multi-style                                 |
| Gaya tutur dataset | Formal, Semi-Formal, Kasual, Keyword Only, Interogatif |
| Jumlah fungsi      | 7 fungsi read-only                                     |
| Deployment AI      | HuggingFace Spaces free tier (FastAPI + Docker)        |
| Backend            | Node.js (Railway)                                      |
| Database           | PostgreSQL (Neon DB)                                   |
| Bot                | Telegram Bot API                                       |
| Frontend           | React + TypeScript + TanStack Query + shadcn/ui + Zod  |

kita belum bahas hasil karena ini ada di bab 4 nanti

### Distribusi Dataset per Fungsi

| Fungsi                 | Train | Eval | Total |
| ---------------------- | ----- | ---- | ----- |
| NO_FUNCTION_CALL       | 25    | 5    | 30    |
| getAvailableItems      | 30    | 10   | 40    |
| getItemHistoryLocation | 25    | 10   | 35    |
| getItemInfo            | 30    | 10   | 40    |
| getItemLocation        | 30    | 10   | 40    |
| getItemStock           | 35    | 5    | 40    |
| getMostBorrowedItems   | 30    | 5    | 35    |
| getUserActiveLoans     | 30    | 10   | 40    |

---

## Arsitektur Sistem

- **Web** → murni manajemen inventaris (CRUD, tracking lokasi, berita acara otomatis, manajemen peminjaman)
- **Telegram bot** → pintu masuk AI natural language (terpisah dari web, tidak ada UI AI di web)
- **AI service** → FastAPI di HuggingFace Spaces, dipanggil oleh backend Node.js
- **Auth Telegram** → pengguna harus terdaftar di database oleh admin sebelum bisa akses bot
- **Mode guest** → semua orang bisa akses website tanpa login

---

## Bab 1 — Final

### 1.1 Latar Belakang

PT. Telkom Indonesia merupakan perusahaan yang bergerak di bidang jasa layanan teknologi informasi dan komunikasi (TIK) serta jaringan telekomunikasi. Sebagai perusahaan yang mengelola infrastruktur teknologi dalam skala besar, pengelolaan aset dan inventaris barang menjadi salah satu kegiatan operasional yang tidak terpisahkan dari aktivitas sehari-hari. Berdasarkan hasil observasi yang dilakukan selama pelaksanaan Kerja Praktek di divisi SSGS (_Shared Service and General Support_) PT. Telkom Indonesia Witel Semarang, ditemukan bahwa pencatatan barang inventaris di lingkungan tersebut masih dilakukan secara manual. Kondisi ini terlihat dari ditemukannya barang-barang yang menumpuk di sejumlah ruangan tanpa keterangan asal-usul maupun status kepemilikannya, serta tidak adanya sistem atau aplikasi internal yang secara konkret menangani pencatatan dan pelacakan pergerakan barang. Penugasan kepada penulis untuk membangun sistem pengelolaan inventaris dari awal memperkuat indikasi bahwa belum tersedia solusi terkomputerisasi yang memadai di lingkungan divisi tersebut.

Kondisi pengelolaan inventaris secara manual sebagaimana yang ditemukan di atas merupakan permasalahan yang umum terjadi di berbagai organisasi. Arribe & Ryandi (2023) menyatakan bahwa sistem pencatatan dan manajemen inventaris secara manual yang masih digunakan sering kali tidak mampu memenuhi kebutuhan perusahaan secara optimal, sehingga menimbulkan masalah seperti kesalahan pencatatan, duplikasi data, dan ketidakakuratan laporan yang berdampak buruk pada efisiensi operasional serta pengambilan keputusan. Lebih lanjut, ketiadaan sistem pelacakan lokasi barang menyebabkan sulitnya mempertanggungjawabkan aset secara transparan, padahal pencatatan yang akurat, transparan, dan mudah diakses merupakan fondasi utama dari pengelolaan inventaris yang baik (Aan et al., 2024 dalam Jurnal JISKA).

Untuk menjawab permasalahan tersebut, dibangun sebuah sistem informasi manajemen inventaris berbasis web yang dilengkapi dengan fitur pelacakan lokasi barang, pencetakan berita acara otomatis saat terjadi perpindahan barang, serta manajemen peminjaman dengan alur persetujuan. Sistem berbasis web dinilai tepat karena memungkinkan akses informasi secara lebih cepat dari berbagai perangkat (Susanto et al., 2021 dalam Mars Journal). Namun demikian, sistem manajemen inventaris konvensional pada umumnya hanya menyediakan antarmuka berbasis menu atau formulir statis yang mengharuskan pengguna menavigasi banyak tahapan untuk memperoleh informasi tertentu. Pendekatan ini membatasi fleksibilitas pengguna dan menurunkan efisiensi interaksi, terutama ketika kebutuhan informasi bersifat spontan dan spesifik.

Perkembangan teknologi _Natural Language Processing_ (NLP) dan _Large Language Model_ (LLM) membuka peluang untuk mengatasi keterbatasan tersebut. Penerapan NLP memungkinkan pengguna berinteraksi dengan sistem menggunakan bahasa alami tanpa harus mengikuti alur navigasi yang kaku (Salamun et al., 2024). Chatbot berbasis NLP yang terintegrasi dengan platform pesan instan seperti Telegram telah terbukti efektif meningkatkan responsivitas layanan dan kemudahan akses informasi bagi pengguna (Lubis et al., 2024). Namun, model bahasa umum seperti GPT-4 atau Gemini memiliki kendala dari sisi biaya operasional yang tinggi serta ketidakmampuannya memahami konteks domain spesifik dan ragam bahasa Indonesia informal yang digunakan di lingkungan kerja.

Untuk mengatasi kendala tersebut, pendekatan _fine-tuning_ pada model bahasa berskala kecil menjadi solusi yang lebih efisien. _Supervised Fine-Tuning_ (SFT) merupakan teknik adaptasi model bahasa di mana model dilatih lebih lanjut pada dataset yang berisi pasangan input dan output berlabel secara terarah, sehingga mampu meningkatkan kemampuan model pada domain dan tugas yang spesifik (Zhang et al., 2024). Paradigma _function calling_ pada LLM memberikan pendekatan yang lebih terstruktur dibandingkan klasifikasi intent tradisional, di mana model secara langsung menghasilkan pemanggilan fungsi beserta argumen yang tepat berdasarkan masukan bahasa alami pengguna (Qu et al., 2024).

Berdasarkan permasalahan yang teridentifikasi dan potensi solusi yang tersedia, pada Kerja Praktek ini dikembangkan sistem informasi manajemen inventaris berbasis web yang dilengkapi dengan asisten virtual berbasis bahasa alami menggunakan model FunctionGemma 270M yang di-_fine-tune_ dengan metode _Supervised Fine-Tuning_. Dataset pelatihan sebanyak 300 sampel disusun secara mandiri dalam bahasa Indonesia dengan variasi gaya tutur formal, kasual, dan bahasa sehari-hari untuk mencerminkan pola komunikasi pengguna yang sesungguhnya. Asisten virtual ini diintegrasikan dengan bot Telegram sehingga karyawan PT. Telkom Indonesia Witel Semarang dapat mengakses informasi inventaris secara natural melalui platform yang sudah familiar. Laporan ini disusun dengan judul "Implementasi Supervised Fine-Tuning FunctionGemma 270M untuk Asisten Virtual Berbasis Natural Language Processing pada Sistem Manajemen Inventaris".

### 1.2 Rumusan Masalah

1. Bagaimana mengimplementasikan _Supervised Fine-Tuning_ model FunctionGemma 270M pada dataset bahasa Indonesia untuk meningkatkan kemampuan pemanggilan fungsi inventaris dibandingkan model dasar (_base model_)?
2. Bagaimana mengintegrasikan layanan AI _function calling_ berbasis model yang telah di-_fine-tune_ dengan bot Telegram dan backend Node.js sebagai antarmuka inventaris berbasis bahasa alami bagi karyawan PT. Telkom Indonesia Witel Semarang?
3. Bagaimana menyusun dataset _function calling_ berbahasa Indonesia yang mencakup variasi gaya tutur formal, kasual, dan informal untuk melatih model asisten virtual pada domain inventaris?

### 1.3 Batasan Masalah

1. Model FunctionGemma 270M hanya dilatih untuk skenario _single-turn_ dan _parallel function calling_, sehingga skenario _multi-turn_ dan _multi-step_ tidak didukung secara eksplisit oleh arsitektur model dasarnya (Google, 2025)
2. Asisten virtual hanya dapat menangani 7 fungsi query inventaris yang bersifat _read-only_, sehingga operasi seperti penambahan, pengeditan, atau penghapusan data barang tidak termasuk dalam cakupan implementasi ini
3. Dataset pelatihan yang digunakan sebanyak 300 sampel disusun secara sintetis dalam bahasa Indonesia, sehingga validasi pada skala dataset yang lebih besar belum dilakukan
4. Model hanya dapat memproses input dalam bahasa Indonesia, sehingga query dalam bahasa lain tidak dapat dijamin menghasilkan _function call_ yang tepat
5. Setiap sesi percakapan bersifat _stateless_, sehingga model tidak menyimpan konteks percakapan dari pesan sebelumnya
6. Layanan asisten virtual berbasis AI hanya dapat diakses melalui platform Telegram, sehingga fitur ini tidak tersedia pada antarmuka web sistem inventaris
7. Layanan AI di-_deploy_ pada HuggingFace Spaces _free tier_, sehingga ketersediaan layanan bergantung pada infrastruktur pihak ketiga dan dapat mengalami _cold start_ atau _timeout_ hingga 30 detik

### 1.4 Tujuan

1. Mengimplementasikan _Supervised Fine-Tuning_ model FunctionGemma 270M pada dataset bahasa Indonesia untuk meningkatkan kemampuan pemanggilan fungsi inventaris dibandingkan model dasar (_base model_)
2. Mengintegrasikan layanan AI _function calling_ berbasis model yang telah di-_fine-tune_ dengan bot Telegram dan backend Node.js sebagai antarmuka inventaris berbasis bahasa alami bagi karyawan PT. Telkom Indonesia Witel Semarang
3. Menyusun dataset _function calling_ berbahasa Indonesia yang mencakup variasi gaya tutur formal, kasual, dan informal untuk melatih model asisten virtual pada domain inventaris

### 1.5 Manfaat

Hasil pelaksanaan Kerja Praktek ini diharapkan dapat memberikan manfaat bagi beberapa pihak sebagai berikut.

**1. Bagi Mitra**

Sistem informasi manajemen inventaris yang dibangun dapat membantu karyawan PT. Telkom Indonesia Witel Semarang dalam melakukan pencatatan, pelacakan lokasi, dan pengelolaan peminjaman barang secara lebih terstruktur dan efisien. Selain itu, tersedianya asisten virtual berbasis bahasa alami melalui bot Telegram memungkinkan karyawan untuk memperoleh informasi inventaris secara cepat tanpa harus menavigasi antarmuka yang kompleks.

**2. Bagi Mahasiswa**

Pelaksanaan Kerja Praktek ini memberikan pengalaman langsung dalam merancang dan mengimplementasikan sistem berbasis kecerdasan buatan, khususnya dalam hal penyusunan dataset, _Supervised Fine-Tuning_ model bahasa menggunakan library `trl`, serta pengintegrasian layanan AI ke dalam sistem nyata yang digunakan di lingkungan profesional.

**3. Bagi Perguruan Tinggi**

Laporan Kerja Praktek ini dapat menjadi salah satu dokumentasi implementasi teknologi kecerdasan buatan yang dilakukan oleh mahasiswa di lingkungan industri nyata, sehingga dapat memperkaya referensi akademis serta mendukung pengembangan kurikulum yang relevan dengan kebutuhan industri teknologi saat ini.

**4. Bagi Pengembang dan Peneliti**

Laporan ini dapat dijadikan referensi praktis bagi pengembang atau peneliti yang ingin mengimplementasikan _fine-tuning_ model bahasa kecil untuk kebutuhan domain spesifik, khususnya dalam konteks _function calling_ berbahasa Indonesia dengan sumber daya komputasi yang terbatas.

---

## Referensi Bab 1

| No  | Sitasi                 | Keterangan                                                        |
| --- | ---------------------- | ----------------------------------------------------------------- |
| 1   | Arribe & Ryandi (2023) | Keterbatasan sistem manual                                        |
| 2   | Aan et al. (2024)      | Fondasi inventaris yang baik — **perlu verifikasi judul lengkap** |
| 3   | Susanto et al. (2021)  | Sistem berbasis web — **perlu verifikasi judul lengkap**          |
| 4   | Salamun et al. (2024)  | NLP untuk interaksi bahasa alami                                  |
| 5   | Lubis et al. (2024)    | Chatbot Telegram + LLM                                            |
| 6   | Zhang et al. (2024)    | Supervised Fine-Tuning / Instruction Tuning — arXiv:2308.10792    |
| 7   | Qu et al. (2024)       | Function calling pada LLM                                         |
| 8   | Google (2025)          | Dokumentasi resmi FunctionGemma                                   |

---

## Status Penulisan

- [x] 1.1 Latar Belakang
- [x] 1.2 Rumusan Masalah
- [x] 1.3 Batasan Masalah
- [x] 1.4 Tujuan
- [x] 1.5 Manfaat
- [ ] Bab 2 Landasan Teori ← lanjut di sini
- [ ] Bab 3 Tempat Kerja Praktek
- [ ] Bab 4 Hasil dan Pembahasan
- [ ] Bab 5 Penutup

---

## Catatan Penting untuk Claude Berikutnya

- **Jangan sebut QLoRA, LoRA, atau kuantisasi 4-bit** — metode yang dipakai adalah SFT murni
- **Frontend web tidak punya fitur AI** — AI hanya di Telegram bot
- **Gaya penulisan**: formal akademis tapi mengalir, hindari em dash, pola "..., sehingga..." untuk sebab-akibat
- **Format sitasi**: APA — (Nama, Tahun), jurnal/prosiding maks 5 tahun, buku maks 10 tahun
