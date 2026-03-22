Ini adalah dokumen konteks komprehensif mengenai peran dan implementasi teknis yang dikerjakan oleh **Ferdian** sebagai **Frontend Developer** selama magang (Kerja Praktek) di PT. Telkom Indonesia Witel Semarang.

# Role & Identity
- **Nama**: Ferdian
- **Posisi KP**: Frontend Developer (merangkap Project Manager & AI Engineer)
- **Project**: Inventel (Sistem Informasi Manajemen Inventaris dengan Asisten Virtual Telegram)

Dokumen ini ditujukan kepada AI (Claude/ChatGPT/Copilot) untuk memberikan **konteks penuh dan ringkas** tentang *apa saja yang dikerjakan pada sisi Frontend web application*. Gunakan dokumen ini sebagai referensi utama saat membahas peran Frontend dari system Inventel.

---

## 1. Konteks Frontend (Aplikasi Web Inventel)

Sebagai Frontend Developer, Ferdian membangun antarmuka web (Client-Side) dari nol yang difokuskan sebagai alat/dashboard manajerial utama bagi Admin dan PIC (Person in Charge) untuk melakukan CRUD, pelacakan lokasi aset, pelaporan, dan manajemen peminjaman barang. *(Catatan: Fitur percakapan AI/Bot tidak ada di antarmuka web ini, melainkan berada murni di sisi Telegram Bot).*

### 1.1 Technology Stack Frontend
- **Core Framework**: `React`, `TypeScript`, `Vite`
- **State Management & Data Fetching**: `TanStack Query (React Query)`
- **Styling & UI Kit**: `Tailwind CSS`, `shadcn/ui` custom components
- **Routing**: `React Router`
- **Form Validation**: `react-hook-form` + `Zod`

### 1.2 Cakupan Fitur Utama (Core Features)
Aplikasi web ini mendigitalisasi proses manual (spreadsheet/kertas) menjadi sistem terintegrasi dengan fitur-fitur berikut:
1. **Manajemen Inventaris**: Sistem CRUD menyeluruh untuk Item Master dan Unit Barang. Mendukung pelacakan kondisi (*good, damaged, broken*) dan pelacakan historis perpindahan unit.
2. **Sistem Manajemen QR Code**: Frontend otomatis merender bentuk fisik QR Code untuk setiap identitas unit barang menggunakan library `qrcode.react`, mempermudah pelacakan aset fisik di gudang.
3. **Manajemen Permintaan (Peminjaman & Mutasi)**: Alur kerja permohonan peminjaman atau pemindahan aset oleh role PIC, beserta sistem *approval/rejection* untuk role Admin.
4. **Tying Akun Telegram (QR Code Linker)**: Alur *onboarding* interaktif pertautan akun web ke Telegram bot secara sinkron. Frontend menampilkan QR deep-link dan menggunakan mekanisme *long-polling* berinterval 3 detik (via `setInterval` pada `useEffect`) untuk mengecek status tautan secara real-time ke database API. Jika terhubung, sistem otomatis beralih ke halaman dashboard utama tanpa reload halaman.
5. **Autentikasi & RBAC (Role-Based Access Control)**: Sistem autentikasi ketat untuk pemisahan layout dan otoritas akses antara role `admin` (akses sistem utilitas penuh) dan tipe akun `pic` (akses sangat terbatas pada reporting dan request items).

### 1.3 Arsitektur Frontend (`Feature-Based`)
Di dalam direktori `src/`, kode diatur tidak berdasarkan tipe komponen horizontal (memisahkan *semua* file view di satu tempat, dan *semua* file logic di tempat lain), melainkan mengadopsi struktur vertikal **Feature-Based Architecture**. Ini membuat aplikasi sangat modular dan *scalable*:

```text
src/
├── features/
│   ├── auth/          # Sistem autentikasi, layout login, proses verifikasi QR Telegram
│   ├── barang/        # Detail Item Master, upload foto carousel, CRUD data unit
│   ├── permintaan/    # Manajemen formulir dan detail Request peminjaman barang
│   ├── transfer/      # Manajemen mutasi lokasi perpindahan barang
│   ├── notifikasi/    # UI tray notification
│   └── dll (akun, lokasi, audit, beranda)
├── components/        # Shared global UI components (radix-ui/shadcn primitives, custom UI pattern)
├── lib/               # Wrapper / utility global (seperti custom fetch API interceptors)
└── hooks/             # Custom hooks re-usable lintas fitur
```

Konsep utama rancangan ini: setiap folder *feature* (misal isian direktori `features/barang`) memiliki enkapsulasi filenya sendiri seperti `api/`, `components/` UI khusus fitur, custom `hooks/`, routing `pages/`, *typing* validasi `schemas/` Zod. Hal ini menciptakan *Separation of Concerns* yang stabil, modifikasi/bug di suatu fitur sangat minim menyebar merusak module fitur lain.

### 1.4 Pendekatan Efisiensi & Best Practice
1. **Optimasi Data Fetching**: Pemanfaatan reaktif `TanStack Query` dengan kontrol *staleTime* dan *gcTime* ketat untuk mengurangi redundant request API (*over-fetching*), mengaktifkan optimistic UI yang membuat pengalaman User Experience terasa instan secepat aplikasi spasial/lokal.
2. **Reusability lewat Composition**: Membungkus dasar UI logic ke design system komponen yang reusable seperti Data Tabel modular, Alert Dialogs, atau pattern input dari formulir berbasis *composition*.
3. **Type-Safety End-to-End**: Proteksi ketat via tipe `TypeScript` yang sejajar validasinya terhadap struktur database backend. Menjamin properti data balikan endpoint, input komponen, maupun state managemen terhindar dari fatal *runtime error*.
4. **Graceful Loading & Error State Handling**: Desain pengalaman *loading* non-intrusif; menampilkan animatif `Skeleton` disaat proses resolusi *network request* (bukan blank screen loading) dan menampikan tampilan instruktif *Empty State* ketika request data bernilai kosong.

---

> **Pesan Kepada AI System / Copilot**: Dokumen ini merangkum narasi konteks esensial dari pengembangan Front-end. Hindari menganalisa sebaris baris script mentah secara granular saat tidak diperlukan. Jika diminta mengeksekusi fitur Frontend dalam projek ini, pastikan secara konstan menganut dan menghormati batasan pola aturan **Feature-Based Architecture**, penulisan **React Query**, dan validasi berbasis **Zod + TypeScript**.
