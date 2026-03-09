---
title: Endpoints Auth
description: Daftar endpoint autentikasi.
---

## Prefix

```txt
/api/v1/auth
```

## Endpoint

| Method | Path               | Auth         | Keterangan                                                |
| ------ | ------------------ | ------------ | --------------------------------------------------------- |
| `POST` | `/forgot-password` | Public       | Ajukan reset password.                                    |
| `POST` | `/login`           | Public       | Login user. Dibatasi rate limit (10 request/15 menit/IP). |
| `GET`  | `/me`              | Bearer Token | Ambil profil user yang sedang login.                      |
| `POST` | `/logout`          | Bearer Token | Logout sesi user aktif.                                   |
