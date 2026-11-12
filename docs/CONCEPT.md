# Konsep Detail: Login + Referral + Matrix + Bonus Setting

## Alur Utama

### Registrasi
1. User input data + referral code (opsional/wajib tergantung setting)
2. Sistem validasi referral code
3. Buat user baru, set sponsor_id
4. Generate unique referral_code untuk user baru
5. (Opsional) Auto-place ke matrix

### Login
- Standard JWT / session based auth
- Role-based access (Admin vs Member)

### Matrix Placement Logic (Contoh 2x2 / 3x3)
- Cari posisi kosong di matrix sponsor
- Jika penuh → spillover ke downline terdekat yang masih ada slot
- Catat posisi, parent, dan level dalam matrix

### Bonus Engine
Bonus dihitung berdasarkan `bonus_settings` yang aktif:

| Tipe Bonus       | Deskripsi singkat                          |
|------------------|--------------------------------------------|
| Referral Bonus   | Bonus langsung saat ada orang daftar via link |
| Matrix Bonus     | Bonus saat matrix penuh / cycle complete   |
| Matching Bonus   | Bonus dari bonus yang didapat downline     |
| Rank Bonus       | Bonus berdasarkan rank yang dicapai        |
| Leadership       | Bonus volume group                         |

Admin bisa:
- Aktif/nonaktifkan tiap tipe
- Ubah % atau nominal
- Set level maksimal
- Tambah kondisi (JSON)

## Contoh Setting Bonus (JSON-like)

```json
{
  "name": "Direct Referral",
  "type": "referral",
  "percentage": 10,
  "amount": null,
  "level": 1,
  "conditions": {
    "min_package": "basic",
    "only_first_time": true
  },
  "is_active": true
}
```

## Catatan Implementasi

- Gunakan transaksi DB saat penempatan matrix + pencatatan bonus
- Cache tree structure jika matrix dalam (hindari recursive query berat)
- Sediakan admin panel untuk edit bonus_settings tanpa deploy ulang
- Audit log untuk semua perubahan setting bonus
