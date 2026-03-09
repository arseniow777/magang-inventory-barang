---
title: Endpoints Reports
description: Daftar endpoint laporan resmi.
---

## Prefix

```txt
/api/v1/reports
```

Semua endpoint membutuhkan token.

## Endpoint

| Method | Path                   | Role           | Keterangan                           |
| ------ | ---------------------- | -------------- | ------------------------------------ |
| `GET`  | `/`                    | `admin`, `pic` | Ambil daftar report.                 |
| `GET`  | `/:id`                 | `admin`, `pic` | Ambil detail report berdasarkan ID.  |
| `GET`  | `/request/:request_id` | `admin`, `pic` | Ambil report berdasarkan request ID. |
| `GET`  | `/:id/download`        | `admin`, `pic` | Download file report.                |
| `PUT`  | `/:id/approve`         | `admin`        | Setujui report.                      |
| `PUT`  | `/:id/reject`          | `admin`        | Tolak report.                        |
