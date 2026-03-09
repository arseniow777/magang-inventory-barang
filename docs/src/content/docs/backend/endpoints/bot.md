---
title: Endpoints Bot
description: Daftar endpoint integrasi bot Telegram.
---

## Prefix

```txt
/api/v1/bot
```

Modul ini dipakai untuk integrasi bot dan tidak melewati middleware token pada route saat ini.

## Endpoint

| Method | Path                     | Auth   | Keterangan                                     |
| ------ | ------------------------ | ------ | ---------------------------------------------- |
| `GET`  | `/user/:telegram_id`     | Public | Ambil data user berdasarkan Telegram ID.       |
| `GET`  | `/requests/:telegram_id` | Public | Ambil request terbaru berdasarkan Telegram ID. |
| `GET`  | `/reports/:telegram_id`  | Public | Ambil report terbaru berdasarkan Telegram ID.  |
| `GET`  | `/reports/:id/download`  | Public | Download report untuk kebutuhan bot.           |
| `POST` | `/contact-admin`         | Public | Kirim pesan ke admin via kanal bot.            |
