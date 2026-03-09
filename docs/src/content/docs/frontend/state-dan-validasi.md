---
title: State Management dan Validasi
description: Standar state server/client serta validasi form di frontend.
---

## Server State

- Gunakan TanStack Query untuk data dari backend.
- Query key harus konsisten agar cache predictable.
- Gunakan invalidation setelah mutasi data.

## Client State

- Gunakan Zustand untuk state global yang tidak cocok di query cache.
- Simpan state lokal tetap di level komponen jika hanya dipakai lokal.

## Form dan Validasi

- Form dibangun dengan React Hook Form.
- Validasi schema menggunakan Zod.
- Error message harus jelas dan terkait field input.

## Praktik Disarankan

- Hindari call API langsung di komponen presentasi.
- Bungkus request di layer `api/` per feature.
- Gunakan `types/` per feature agar kontrak data eksplisit.
