---
title: Struktur Folder Frontend
description: Penjelasan struktur folder utama frontend.
---

## Struktur Inti

```text
front/
  src/
    components/
    config/
    constants/
    features/
    hooks/
    lib/
```

## Penjelasan Singkat

- `components/`: Komponen lintas fitur, termasuk UI reusable.
- `features/`: Modul bisnis per domain.
- `hooks/`: Custom hooks global.
- `lib/`: Utility umum (API helper, query client, helper function).
- `config/`: Konfigurasi aplikasi (mis. API base config).

## Kenapa Struktur Ini

- Memudahkan scaling karena fokus per domain fitur.
- Mengurangi coupling antar modul.
- Mempercepat pencarian file saat maintenance.
