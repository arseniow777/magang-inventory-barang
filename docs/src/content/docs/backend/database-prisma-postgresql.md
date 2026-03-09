---
title: Database Prisma dan PostgreSQL
description: Prinsip model data, enum, dan migration pada backend.
---

## Stack Database

- ORM: Prisma Client
- Database engine: PostgreSQL
- Schema source of truth: `prisma/schema.prisma`

## Entitas Penting

- `Users`
- `ItemMasters`
- `ItemUnits`
- `Requests`
- `OfficialReports`
- `Notifications`
- `AuditLogs`

## Enum Penting

- `Role`
- `RequestStatus`
- `ReportType`
- `ItemCondition`
- `ItemStatus`
- `NotificationType`

## Alur Perubahan Skema

1. Ubah `prisma/schema.prisma`.
2. Jalankan `npm run prisma:migrate`.
3. Commit file migration yang terbentuk.
4. Jalankan `npm run prisma:generate` jika dibutuhkan.

## Praktik yang Disarankan

- Jangan edit migration lama yang sudah dipakai tim.
- Gunakan nama migration yang jelas sesuai perubahan.
- Selalu verifikasi query di environment development.
