---
title: Endpoints Item Units
description: Daftar endpoint unit barang.
---

## Prefix

```txt
/api/v1/item-units
```

## Endpoint Read

| Method | Path               | Auth   | Keterangan                        |
| ------ | ------------------ | ------ | --------------------------------- |
| `GET`  | `/`                | Public | Ambil daftar unit barang.         |
| `GET`  | `/code/:unit_code` | Public | Cari unit berdasarkan kode unit.  |
| `GET`  | `/:id`             | Public | Ambil detail unit berdasarkan ID. |
| `GET`  | `/:id/history`     | Public | Ambil riwayat perpindahan unit.   |

## Endpoint Update

| Method | Path   | Role    | Keterangan                                |
| ------ | ------ | ------- | ----------------------------------------- |
| `PUT`  | `/:id` | `admin` | Update status, kondisi, atau lokasi unit. |
