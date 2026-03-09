---
title: Endpoints Password Resets
description: Daftar endpoint approval reset password.
---

## Prefix

```txt
/api/v1/password-resets
```

Semua endpoint membutuhkan token dan role `admin`.

## Endpoint

| Method | Path           | Role    | Keterangan                             |
| ------ | -------------- | ------- | -------------------------------------- |
| `GET`  | `/`            | `admin` | Ambil daftar pengajuan reset password. |
| `PUT`  | `/:id/approve` | `admin` | Setujui pengajuan reset password.      |
| `PUT`  | `/:id/reject`  | `admin` | Tolak pengajuan reset password.        |
