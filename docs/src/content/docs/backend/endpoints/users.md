---
title: Endpoints Users
description: Daftar endpoint manajemen pengguna.
---

## Prefix

```txt
/api/v1/users
```

Semua endpoint pada modul ini membutuhkan token.

## Endpoint User Aktif

| Method | Path                      | Role           | Keterangan                        |
| ------ | ------------------------- | -------------- | --------------------------------- |
| `GET`  | `/me`                     | `admin`, `pic` | Ambil profil user login.          |
| `PUT`  | `/me`                     | `admin`, `pic` | Update profil user login.         |
| `POST` | `/telegram/generate-link` | `admin`, `pic` | Generate link koneksi Telegram.   |
| `POST` | `/telegram/disconnect`    | `admin`, `pic` | Putuskan akun Telegram dari user. |

## Endpoint Admin

| Method   | Path   | Role    | Keterangan                        |
| -------- | ------ | ------- | --------------------------------- |
| `GET`    | `/`    | `admin` | Ambil daftar semua user.          |
| `GET`    | `/:id` | `admin` | Ambil detail user berdasarkan ID. |
| `POST`   | `/`    | `admin` | Buat user baru.                   |
| `PUT`    | `/:id` | `admin` | Update data user.                 |
| `DELETE` | `/:id` | `admin` | Hapus user.                       |
