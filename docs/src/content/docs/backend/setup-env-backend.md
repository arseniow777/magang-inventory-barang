---
title: Setup dan Environment Backend
description: Langkah menjalankan backend secara lokal.
---

## Prasyarat

- Node.js versi LTS
- PostgreSQL aktif
- Package manager npm

## Instalasi

```bash
cd backend
npm install
```

## Konfigurasi Environment

Buat file `.env` di folder `backend` dan isi variabel penting:

```ini
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET=isi_dengan_secret_yang_kuat
PORT=3000
```

## Menjalankan Aplikasi

```bash
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Seed Data (Opsional)

```bash
npm run prisma:seed
```
