---
title: Endpoints Audit Logs
description: Daftar endpoint audit log.
---

## Prefix

```txt
/api/v1/audit-logs
```

Semua endpoint membutuhkan token.

## Endpoint untuk Semua User Login

| Method | Path                              | Role           | Keterangan                     |
| ------ | --------------------------------- | -------------- | ------------------------------ |
| `GET`  | `/entity/:entity_type/:entity_id` | `admin`, `pic` | Ambil log berdasarkan entitas. |

## Endpoint Admin

| Method | Path              | Role    | Keterangan                        |
| ------ | ----------------- | ------- | --------------------------------- |
| `GET`  | `/`               | `admin` | Ambil daftar audit log.           |
| `GET`  | `/export`         | `admin` | Export audit log.                 |
| `GET`  | `/:id`            | `admin` | Ambil detail audit log.           |
| `GET`  | `/actor/:user_id` | `admin` | Ambil log berdasarkan actor user. |
