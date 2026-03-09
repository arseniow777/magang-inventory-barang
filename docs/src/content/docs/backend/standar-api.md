---
title: Standar API
description: Standar request, response, auth, dan error pada backend.
---

## Prinsip Endpoint

- Endpoint dikelompokkan berdasarkan resource domain.
- Gunakan method HTTP sesuai aksi (`GET`, `POST`, `PUT/PATCH`, `DELETE`).
- Endpoint private wajib melewati middleware auth.

## Format Response Sukses

Gunakan bentuk response yang konsisten agar frontend mudah diparsing.

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

## Format Response Error

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": []
}
```

## Auth dan Izin

- Token berbasis JWT.
- Role utama: `admin` dan `pic`.
- Validasi role dilakukan pada endpoint sensitif.

## Catatan Integrasi Frontend

- Frontend perlu menangani status code `401`, `403`, `404`, dan `422`.
- Gunakan interceptor/fungsi util API untuk format error seragam.
