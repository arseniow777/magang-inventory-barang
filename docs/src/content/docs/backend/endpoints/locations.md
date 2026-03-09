---
title: Endpoints Locations
description: Daftar endpoint lokasi.
---

## Prefix

```txt
/api/v1/locations
```

Semua endpoint membutuhkan token.

## Endpoint

| Method   | Path   | Role           | Keterangan           |
| -------- | ------ | -------------- | -------------------- |
| `GET`    | `/`    | `admin`, `pic` | Ambil daftar lokasi. |
| `GET`    | `/:id` | `admin`, `pic` | Ambil detail lokasi. |
| `POST`   | `/`    | `admin`        | Buat lokasi baru.    |
| `PUT`    | `/:id` | `admin`        | Update data lokasi.  |
| `DELETE` | `/:id` | `admin`        | Hapus lokasi.        |
