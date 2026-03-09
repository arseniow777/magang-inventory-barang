---
title: Konvensi Kode
description: Standar penulisan kode agar frontend dan backend tetap konsisten.
---

## Konvensi Umum

- Gunakan nama file yang deskriptif berdasarkan domain.
- Pisahkan concern berdasarkan lapisan (`routes`, `controllers`, `middleware`, `utils`).
- Hindari duplikasi logika bisnis lintas module.

## Backend

- Validasi input dilakukan sebelum masuk proses bisnis utama.
- Response API gunakan format konsisten untuk sukses dan error.
- Query database selalu lewat Prisma client.

## Frontend

- Ikuti arsitektur feature-based pada folder `src/features`.
- Pisahkan `api`, `hooks`, `components`, dan `types` di setiap fitur.
- Form wajib memiliki validasi schema untuk mencegah data invalid.

## Dokumentasi

- Setiap fitur baru wajib menambah atau memperbarui halaman docs terkait.
- Changelog dokumentasi dicatat agar perubahan mudah ditelusuri.
