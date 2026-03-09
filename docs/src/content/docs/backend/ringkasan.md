---
title: Ringkasan Backend
description: Gambaran umum service backend inventory.
---

## Peran Backend

Backend bertanggung jawab untuk:

- Menyediakan REST API untuk semua modul inventory.
- Menjalankan autentikasi dan otorisasi berbasis role.
- Menyimpan, memproses, dan melacak data inventory di database.

## Struktur Utama

- `src/controllers`: Logika handler per endpoint.
- `src/routes`: Definisi route API.
- `src/middleware`: Auth, validasi, dan pengamanan request.
- `src/config/prisma.js`: Inisialisasi Prisma client.
- `prisma/schema.prisma`: Definisi skema data dan relasi.

## Domain Utama

- Auth dan users
- Item masters dan item units
- Locations
- Requests dan reports
- Notifications dan audit logs
