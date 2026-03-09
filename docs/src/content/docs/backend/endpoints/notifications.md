---
title: Endpoints Notifications
description: Daftar endpoint notifikasi.
---

## Prefix

```txt
/api/v1/notifications
```

Semua endpoint membutuhkan token.

## Endpoint

| Method   | Path                 | Role           | Keterangan                          |
| -------- | -------------------- | -------------- | ----------------------------------- |
| `POST`   | `/contact-admin/web` | `admin`, `pic` | Kirim pesan kontak admin dari web.  |
| `GET`    | `/`                  | `admin`, `pic` | Ambil daftar notifikasi user login. |
| `GET`    | `/:id`               | `admin`, `pic` | Ambil detail notifikasi.            |
| `DELETE` | `/:id`               | `admin`        | Hapus notifikasi.                   |
