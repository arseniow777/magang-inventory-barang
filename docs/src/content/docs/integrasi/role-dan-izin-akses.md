---
title: Role dan Izin Akses
description: Ringkasan mapping role terhadap fitur utama aplikasi.
---

## Role Utama

- `admin`
- `pic`

## Prinsip Otorisasi

- `admin` memiliki kontrol penuh untuk approval, user management, dan konfigurasi operasional.
- `pic` berfokus pada operasional barang dan pengajuan sesuai area kerja.

## Mapping Akses Tingkat Tinggi

- Manajemen pengguna: `admin`
- Persetujuan laporan penting: `admin`
- Operasi harian item dan request: `admin`, `pic` sesuai kebijakan endpoint
- Akses audit log: terutama `admin`

## Catatan Implementasi

Detail izin final harus mengacu pada middleware authorization backend yang aktif.
Jika aturan role berubah, update dokumen ini bersamaan dengan update endpoint.
