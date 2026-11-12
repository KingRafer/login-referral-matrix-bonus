# Login + Referral + Matrix + Configurable Bonus

Konsep sistem keanggotaan (membership) dengan fitur:

- **Login / Auth** – registrasi & login user
- **Referral System** – setiap user punya kode referral, tracking sponsor/upline
- **Matrix Structure** – struktur matrix (biasanya 2x2, 3x3, atau custom) untuk penempatan member
- **Bonus yang Bisa Di-setting** – admin bisa mengatur jenis bonus, persentase, level, dan kondisi

---

## 🌐 Web Demo (Live)

Ada **versi web interaktif** yang sudah siap dicoba:

📁 Folder: [`web/`](./web/)

### Cara menjalankan lokal

```bash
# Clone repo
git clone https://github.com/KingRafer/login-referral-matrix-bonus.git
cd login-referral-matrix-bonus/web

# Buka langsung di browser (atau pakai live server)
# Contoh dengan Python:
python -m http.server 8080
# Lalu buka http://localhost:8080
```

Atau buka file `web/index.html` langsung di browser.

### Akun Demo

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@demo.com   | admin123  |
| Member| budi@mail.com    | 123456    |

### Fitur Web Demo

| Halaman            | Fitur                                      |
|--------------------|--------------------------------------------|
| **Login / Register** | Auth + support kode referral              |
| **Dashboard**      | Statistik downline, bonus, rank, aktivitas |
| **Referral**       | Link referral + daftar downline multi-level|
| **Matrix**         | Visualisasi tree 2×2 / 3×3 + spillover     |
| **Bonus Saya**     | Riwayat bonus per tipe                     |
| **Setting Bonus**  | CRUD bonus (nama, tipe, %, level, aktif)   |
| **Members**        | Daftar semua member                        |

Data disimpan di **localStorage** browser, jadi tetap ada meski refresh.

---

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

## Struktur Folder

```
login-referral-matrix-bonus/
├── web/                     # ← Demo web interaktif (HTML + JS)
│   ├── index.html
│   └── js/app.js
├── docs/                    # Dokumentasi konsep
│   └── CONCEPT.md
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

## Tech Stack Suggestion (untuk production)

| Layer       | Pilihan                          |
|-------------|----------------------------------|
| Backend     | NestJS / Laravel / Express       |
| Frontend    | Next.js / Vue 3 + Pinia          |
| Database    | PostgreSQL / MySQL               |
| Auth        | JWT + Refresh Token              |
| Realtime    | Socket.io (opsional untuk notif) |

---

Dibuat untuk eksperimen sistem referral + matrix dengan bonus dinamis.
