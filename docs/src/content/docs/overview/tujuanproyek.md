---
title: Tujuan Proyek
description: Gambaran tujuan dan ruang lingkup aplikasi inventory.
---

## Latar Belakang

Proyek ini dikembangkan untuk menjawab kebutuhan pengelolaan inventaris barang lintas lokasi secara terpusat dan efisien. Selama ini, pencatatan aset dilakukan secara manual dan tersebar, sehingga menyulitkan tim dalam memantau keberadaan, kondisi, dan riwayat perpindahan barang secara real-time. Aplikasi ini hadir sebagai solusi digital yang mengintegrasikan seluruh proses inventarisasi ke dalam satu platform terpadu.

## Tujuan Utama

- Menyediakan pencatatan barang dan unit barang yang konsisten, terstruktur, dan dapat diaudit kapan saja.
- Mendukung alur permintaan, peminjaman, transfer, dan pelaporan barang secara end-to-end.
- Melacak lokasi aset agar keberadaan setiap unit barang selalu dapat dipantau.
- Menyimpan riwayat perpindahan lokasi aset untuk keperluan audit dan penelusuran histori.
- Menyediakan jejak audit lengkap agar setiap aktivitas penting dalam sistem dapat dilacak dan dipertanggungjawabkan.
- Mempercepat operasional tim melalui dashboard informatif, notifikasi otomatis, dan akses berbasis peran.
- Mengintegrasikan bot Telegram sebagai kanal notifikasi dan interaksi cepat bagi pengguna.
- Menyediakan laporan berita acara otomatis dalam format PDF untuk mendukung kebutuhan dokumentasi formal.
- Menghadirkan fitur AI berbasis model bahasa natural untuk memudahkan pencarian dan query data inventaris secara natural.

## Ruang Lingkup

- **Backend**: REST API berbasis Express dan Prisma ORM dengan PostgreSQL sebagai basis data utama.
- **Frontend**: Antarmuka React berbasis fitur untuk seluruh modul bisnis inventory, termasuk dashboard, manajemen barang, pengguna, lokasi, dan permintaan.
- **Asset Management**: Pengelolaan unit barang per item dengan status, kondisi, dan lokasi yang selalu ter-update.
- **Location Tracking**: Sistem pelacakan lokasi aset dengan riwayat perpindahan yang tercatat secara otomatis setiap terjadi mutasi barang.
- **Role-Based Access Control**: Pembatasan akses dan fitur berdasarkan peran pengguna (Admin, Member, PIC).
- **Integrasi Bot Telegram**: Notifikasi, persetujuan permintaan, reset password, dan unduhan berita acara langsung melalui Telegram.
- **AI Query Service**: Layanan inferensi berbasis FunctionGemma yang di-deploy ke HuggingFace Spaces untuk mendukung pencarian inventaris secara natural language.
- **Audit Log**: Pencatatan seluruh aktivitas sistem secara otomatis untuk kebutuhan transparansi dan kepatuhan.
