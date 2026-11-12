# Login + Referral + Matrix + Configurable Bonus

Konsep sistem keanggotaan (membership) dengan fitur:

- **Login / Auth** – registrasi & login user
- **Referral System** – setiap user punya kode referral, tracking sponsor/upline
- **Matrix Structure** – struktur matrix (biasanya 2x2, 3x3, atau custom) untuk penempatan member
- **Bonus yang Bisa Di-setting** – admin bisa mengatur jenis bonus, persentase, level, dan kondisi

## Fitur Utama (Konsep)

### 1. Authentication
- Register dengan referral code (opsional/wajib)
- Login (email/username + password)
- Role: Admin & Member

### 2. Referral
- Setiap member mendapat unique referral code
- Tracking downline langsung (level 1) dan multi-level
- Statistik referral (jumlah downline, active, dll)

### 3. Matrix Placement
- Penempatan otomatis atau manual ke dalam matrix
- Support berbagai ukuran matrix (contoh: 2x2, 3x3, 5x5)
- Spillover / overflow handling
- Visualisasi matrix tree

### 4. Bonus System (Configurable)
Admin dapat mengatur:
- Jenis bonus (Referral Bonus, Matrix Bonus, Matching Bonus, Rank Bonus, dll)
- Persentase / nominal
- Level yang mendapat bonus
- Syarat (minimal downline, volume, rank, dll)
- Status aktif/nonaktif

## Struktur Folder (Saran)

```
login-referral-matrix-bonus/
├── backend/                 # API (Node.js / Laravel / NestJS / etc)
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── referral/
│   │   ├── matrix/
│   │   ├── bonus/
│   │   └── settings/
│   └── ...
├── frontend/                # Dashboard (React / Vue / Next.js)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
├── docs/                    # Dokumentasi konsep & flowchart
├── database/                # Migration / schema example
└── README.md
```

## Database Concept (Ringkas)

**users**
- id, username, email, password, referral_code, sponsor_id, rank, status, created_at

**matrix_positions**
- id, user_id, matrix_id, position, parent_position, level, created_at

**bonus_settings**
- id, name, type, percentage, amount, level, conditions (JSON), is_active

**bonus_transactions**
- id, user_id, bonus_type, amount, from_user_id, description, status, created_at

**referrals**
- id, user_id, referred_user_id, level, created_at

## Cara Pakai Repo Ini

1. Clone repo
2. Pilih tech stack (bisa Laravel + Vue, NestJS + React, dll)
3. Implementasikan sesuai konsep di atas
4. Sesuaikan bonus settings lewat admin panel

## Tech Stack Suggestion

| Layer       | Pilihan                          |
|-------------|----------------------------------|
| Backend     | NestJS / Laravel / Express       |
| Frontend    | Next.js / Vue 3 + Pinia          |
| Database    | PostgreSQL / MySQL               |
| Auth        | JWT + Refresh Token              |
| Realtime    | Socket.io (opsional untuk notif) |

## Status

Ini adalah **starter concept repo**. Belum ada implementasi kode. Silakan develop sesuai kebutuhan.

---

Dibuat untuk eksperimen sistem referral + matrix dengan bonus dinamis.
