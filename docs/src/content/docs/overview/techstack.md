---
title: Tech Stack
description: Daftar stack yang digunakan pada backend, frontend, database, dan dokumentasi.
---

## Backend

- Runtime: Node.js
- Framework: Express 5
- ORM: Prisma
- Database: PostgreSQL
- Auth: JSON Web Token (`jsonwebtoken`) + `bcryptjs`
- Security: `helmet`, `cors`, `express-rate-limit`
- File handling: `multer`
- Export document: `pdfkit`, `exceljs`
- Bot integration: `node-telegram-bot-api`

## Frontend

- Framework: React 19 + TypeScript
- Build tool: Vite
- Routing: React Router
- Server state: TanStack Query
- Client state: Zustand
- Form handling: React Hook Form + Zod
- Styling: Tailwind CSS v4 + `shadcn/ui` + Base UI
- Charts and utilities: Recharts, date-fns, Sonner

## Dokumentasi

- Static docs framework: Astro
- Docs theme/system: Starlight

## Kenapa Stack Ini

- Konsisten dengan kebutuhan CRUD dan workflow inventory yang cepat berubah.
- Komunitas dan dokumentasi library kuat, mudah maintenance.
- Pembagian stack modern memudahkan pengembangan paralel frontend dan backend.
