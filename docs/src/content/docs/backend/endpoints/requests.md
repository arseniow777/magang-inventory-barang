---
title: Endpoints Requests
description: Daftar endpoint permintaan barang.
---

## Prefix

```txt
/api/v1/requests
```

Semua endpoint membutuhkan token.

## Endpoint Umum

| Method | Path               | Role           | Keterangan                             |
| ------ | ------------------ | -------------- | -------------------------------------- |
| `POST` | `/`                | `admin`, `pic` | Buat request baru.                     |
| `GET`  | `/my-requests`     | `admin`, `pic` | Ambil daftar request milik user login. |
| `GET`  | `/my-requests/:id` | `admin`, `pic` | Ambil detail request milik user login. |
| `GET`  | `/:id`             | `admin`, `pic` | Ambil detail request berdasarkan ID.   |

## Endpoint Admin

| Method | Path                   | Role    | Keterangan                    |
| ------ | ---------------------- | ------- | ----------------------------- |
| `GET`  | `/`                    | `admin` | Ambil semua request.          |
| `GET`  | `/pending`             | `admin` | Ambil request status pending. |
| `GET`  | `/active`              | `admin` | Ambil request aktif.          |
| `PUT`  | `/:id/approve`         | `admin` | Setujui request.              |
| `PUT`  | `/:id/confirm-arrival` | `admin` | Konfirmasi barang tiba.       |
| `PUT`  | `/:id/reject`          | `admin` | Tolak request.                |
| `PUT`  | `/:id/return`          | `admin` | Proses pengembalian request.  |
| `PUT`  | `/:id/cancel`          | `admin` | Batalkan request.             |
