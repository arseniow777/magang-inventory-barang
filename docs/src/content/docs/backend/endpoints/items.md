---
title: Endpoints Items
description: Daftar endpoint item master dan foto item.
---

## Prefix

```txt
/api/v1/items
```

## Endpoint Public

| Method | Path                 | Auth   | Keterangan                     |
| ------ | -------------------- | ------ | ------------------------------ |
| `GET`  | `/`                  | Public | Ambil daftar item master.      |
| `GET`  | `/condition-summary` | Public | Ringkasan kondisi unit barang. |
| `GET`  | `/:id`               | Public | Ambil detail item master.      |

## Endpoint Admin

| Method   | Path                   | Role    | Keterangan                             |
| -------- | ---------------------- | ------- | -------------------------------------- |
| `POST`   | `/`                    | `admin` | Buat item baru, mendukung upload foto. |
| `POST`   | `/:id/restock`         | `admin` | Tambah stok unit untuk item.           |
| `PUT`    | `/:id`                 | `admin` | Update item master.                    |
| `POST`   | `/:id/photos`          | `admin` | Tambah foto item.                      |
| `DELETE` | `/:id/photos/:photoId` | `admin` | Hapus foto item.                       |
