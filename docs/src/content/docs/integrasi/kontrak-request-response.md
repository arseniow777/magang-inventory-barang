---
title: Kontrak Request dan Response
description: Aturan integrasi data antara frontend dan backend.
---

## Tujuan

Dokumen ini mendefinisikan pola komunikasi frontend-backend agar implementasi konsisten.

## Aturan Umum

- Semua response API menggunakan struktur konsisten.
- Endpoint private membutuhkan token JWT pada header `Authorization`.
- Error response harus menyertakan pesan yang bisa ditampilkan di UI.

## Header Wajib

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Kontrak Response Sukses

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

## Kontrak Response Error

```json
{
  "success": false,
  "message": "Operasi gagal",
  "errors": []
}
```
