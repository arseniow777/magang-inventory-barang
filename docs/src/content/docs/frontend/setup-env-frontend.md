---
title: Setup dan Environment Frontend
description: Langkah menjalankan frontend secara lokal.
---

## Prasyarat

- Node.js versi LTS
- Backend API sudah berjalan

## Instalasi

```bash
cd front
npm install
```

## Konfigurasi Environment

Buat file `.env` sesuai kebutuhan API endpoint. Contoh:

```ini
VITE_API_BASE_URL=http://localhost:3000
```

## Menjalankan Aplikasi

```bash
npm run dev
```

## Build Produksi

```bash
npm run build
npm run preview
```
