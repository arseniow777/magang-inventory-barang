---
title: Struktur Folder Backend
description: Penjelasan struktur folder backend dan fungsinya.
---

## Struktur Inti

```text
backend/
  prisma/
    schema.prisma
    seed.js
    migrations/
  src/
    config/
    controllers/
    middleware/
    routes/
    utils/
  uploads/
```

## Penjelasan Singkat

- `prisma/`: Definisi model, migration, dan data seed.
- `src/controllers/`: Implementasi use case per resource.
- `src/routes/`: Binding endpoint ke controller.
- `src/middleware/`: Layer keamanan dan validasi request.
- `src/utils/`: Helper function reusable.
- `uploads/`: Penyimpanan file upload (item, official report).

## Kenapa Struktur Ini

- Mudah ditelusuri berdasarkan tanggung jawab folder.
- Memudahkan onboarding karena pola umum Express.
- Mudah diperluas saat domain baru ditambahkan.
