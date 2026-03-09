---
title: Endpoint Overview
description: Daftar modul endpoint backend API v1.
---

## Base URL

Semua endpoint backend berada di bawah prefix:

```txt
/api/v1
```

## Modul Endpoint

- `/auth`
- `/users`
- `/items`
- `/item-units`
- `/locations`
- `/requests`
- `/reports`
- `/audit-logs`
- `/notifications`
- `/password-resets`
- `/bot`

## Catatan Umum

- Endpoint yang membutuhkan login menggunakan JWT di header `Authorization`.
- Kecuali disebutkan berbeda, format response mengikuti standar pada halaman `Backend > Standar API`.
