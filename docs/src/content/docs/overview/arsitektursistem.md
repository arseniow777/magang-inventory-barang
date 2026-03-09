---
title: Arsitektur Sistem
description: Ringkasan arsitektur aplikasi inventory dari sisi frontend dan backend.
---

## Gambaran Umum

Sistem menggunakan arsitektur client-server:

- Frontend (`front`) sebagai aplikasi React untuk antarmuka pengguna.
- Backend (`backend`) sebagai REST API yang mengelola logika bisnis.
- Database PostgreSQL sebagai penyimpanan data transaksi inventory.

## Alur Data

1. User mengakses halaman pada frontend.
2. Frontend memanggil endpoint backend menggunakan HTTP.
3. Backend memvalidasi request, menjalankan logika bisnis, lalu membaca/menulis data melalui Prisma.
4. Backend mengembalikan response JSON ke frontend untuk ditampilkan.

## Komponen Inti

- `controllers`: Menangani request API per domain.
- `routes`: Mendefinisikan endpoint yang dipublikasikan.
- `middleware`: Menangani auth, validasi, dan keamanan request.
- `features` (frontend): Memisahkan kode berdasarkan domain bisnis agar scalable.

## Kenapa Model Ini Dipakai

- Mudah dipahami oleh developer baru.
- Memisahkan concern UI, business logic, dan data access.
- Cocok untuk kebutuhan iterasi cepat fitur inventory internal.
