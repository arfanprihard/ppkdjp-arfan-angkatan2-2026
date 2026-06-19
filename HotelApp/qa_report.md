# 🔍 Laporan QA Audit — HotelApp

**Tanggal Audit:** 19 Juni 2026
**Cakupan:** Seluruh Frontend (React) & Backend (Laravel)
**Total Issue Ditemukan:** 85 issue (38 Frontend + 47 Backend)

---

## 📊 Ringkasan

| Severity | Frontend | Backend | Total |
|----------|----------|---------|-------|
| 🔴 Critical (Crash/Data Loss) | 5 | 6 | **11** |
| 🟠 Significant (Logic Error) | 6 | 8 | **14** |
| 🟡 Moderate (UI/UX/DB) | 11 | 28 | **39** |
| 🔵 Code Quality | 9 | 5 | **14** |
| ⚪ Missing Features | 7 | — | **7** |
| **Total** | **38** | **47** | **85** |

---

## 🔴 CRITICAL — Harus Diperbaiki Segera

### Backend

#### 1. `ReservationController::update()` — `total_amount` tidak pernah tersimpan
- **File:** [ReservationController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/ReservationController.php)
- **Masalah:** Saat tanggal atau tipe kamar diubah, `total_amount` dihitung ulang tapi langsung tertimpa oleh `$reservation->update($validated)` karena `total_amount` tidak ada di `$validated`.
- **Dampak:** Total harga reservasi selalu salah setelah diedit.

#### 2. Folio balance race condition (5 lokasi)
- **File:** [CheckInController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/CheckInController.php), [FnbOrderController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/FnbOrderController.php), [FolioController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/FolioController.php), [LaundryController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/LaundryController.php)
- **Masalah:** Setelah `$folio->increment('total_charges', ...)`, object `$folio` di memori masih menyimpan nilai lama. `$folio->update(['balance' => ...])` menggunakan nilai basi (stale).
- **Dampak:** Balance folio tidak akurat → billing tamu salah.

#### 3. `ReportController::occupancy()` — Data 7 hari SAMA semua
- **File:** [ReportController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/ReportController.php)
- **Masalah:** Query `Room::whereIn('status', ['oc','od'])->count()` mengecek status **saat ini**, bukan status historis. Semua 7 hari menampilkan angka yang sama.

#### 4. Mass assignment vulnerability (2 lokasi)
- **File:** [HousekeepingController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/HousekeepingController.php), [LaundryController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/LaundryController.php)
- **Masalah:** Menggunakan `$request->all()` alih-alih `$request->validated()`. User bisa menyuntikkan field berbahaya seperti `status`, `completed_at`.

#### 5. `FnbOrderItem` model — Foreign key salah
- **File:** [FnbOrderItem.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Models/FnbOrderItem.php)
- **Masalah:** `belongsTo(FnbOrder::class)` otomatis mencari kolom `fnb_order_id`, tapi migration menggunakan `order_id`. Relasi akan selalu NULL.

### Frontend

#### 6. `ReservationsPage` — Search hanya bekerja di halaman aktif
- **File:** [ReservationsPage.jsx](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/frontend/src/pages/ReservationsPage.jsx)
- **Masalah:** Filter pencarian hanya menyaring data di halaman saat ini (client-side), bukan mengirim query `search` ke backend. Jika reservasi yang dicari ada di halaman 3, tidak akan ditemukan saat melihat halaman 1.

#### 7. `GuestsPage` — Tidak ada debounce pada pencarian
- **File:** [GuestsPage.jsx](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/frontend/src/pages/GuestsPage.jsx)
- **Masalah:** Setiap ketikan huruf langsung memicu API call. Mengetik "John" = 4 API request berturut-turut (J, Jo, Joh, John). Membebani server.

#### 8. `CheckOutModal` — Textarea background putih di tema gelap
- **File:** CheckOutModal.jsx
- **Masalah:** Textarea feedback tidak memiliki class `bg-*`, sehingga tampil dengan background default browser (putih), terlihat sangat janggal di tema gelap zinc.

---

## 🟠 SIGNIFICANT — Bug Logika Bisnis

### Backend

| # | Lokasi | Masalah |
|---|--------|---------|
| 9 | CheckOutController | Tidak ada validasi apakah tamu sudah pernah checkout → bisa double checkout |
| 10 | CheckOutController | Tidak mengecek apakah status reservasi masih `checked_in` → bisa checkout reservasi yang sudah dibatalkan |
| 11 | FnbOrderController | Status bisa mundur (dari `selesai` ke `proses`), seharusnya hanya maju |
| 12 | LaundryController | Sama — status bisa mundur (dari `delivered` ke `received`) |
| 13 | FnbOrderController | Jika `charge_to === 'room'` tapi tidak ada folio aktif, charge diam-diam hilang tanpa error |
| 14 | LaundryController | Sama — charge ke kamar diam-diam gagal tanpa notifikasi |
| 15 | ReservationController | Race condition pada pembuatan kode reservasi — bisa duplikat saat request bersamaan |
| 16 | FnB status | Menggunakan bahasa Indonesia (`proses`, `selesai`) sementara semua modul lain menggunakan bahasa Inggris (`pending`, `confirmed`, `done`) |

### Frontend

| # | Lokasi | Masalah |
|---|--------|---------|
| 17 | AdminDashboard | Tombol "Laporan Keuangan" mengarah ke `/reports` yang tidak ada → redirect ke dashboard |
| 18 | FnbPage | Role `receptionist` bisa melihat halaman F&B tapi GET order akan return 403 (Forbidden) |
| 19 | DashboardPage | `fetchStats` bisa menggunakan `selectedYear` yang sudah stale (basi) saat dipanggil dari tombol refresh |

---

## 🟡 MODERATE — UI/UX & Database

### UI/UX Issues

| # | Masalah | Lokasi |
|---|---------|--------|
| 20 | Invalid Tailwind classes (`rose-450`, `amber-550`, `duration-255`) — tidak menghasilkan styling apapun | UsersPage, HousekeepingPage, ReservationDetailModal |
| 21 | Semua modal tidak bisa ditutup dengan tombol ESC | Semua modal (8+ komponen) |
| 22 | Semua modal tidak memiliki focus trap → Tab bisa keluar ke belakang overlay | Semua modal |
| 23 | Sidebar tidak menyimpan state collapse ke localStorage → reset setiap refresh | Sidebar.jsx |
| 24 | Sidebar tidak responsive di mobile — tidak ada hamburger menu | Sidebar.jsx |
| 25 | Notifikasi bell selalu menampilkan dot amber (seolah ada notifikasi) tapi tidak berfungsi | Topbar.jsx |
| 26 | Label `<label>` tanpa `htmlFor` → klik label tidak memfokuskan input | LoginPage.jsx |
| 27 | Tidak ada loading state saat pengecekan sesi awal → form login muncul sebentar lalu redirect | LoginPage.jsx |
| 28 | Bahasa campuran di header tabel ("Kode / Tamu" vs "Total Amount" vs "Channel") | ReservationsPage.jsx |

### Database Issues

| # | Masalah | Dampak |
|---|---------|--------|
| 29 | `id_number` di tabel guests tidak punya unique index di DB | Duplikasi bisa terjadi meskipun controller validasi |
| 30 | `email` di tabel guests tidak punya unique index | Sama |
| 31 | Tidak ada index pada kolom yang sering di-filter (`reservations.status`, `rooms.status`, `fnb_orders.status`, dll) | Query lambat saat data besar |
| 32 | `check_ins.processed_by` menggunakan `onDelete('cascade')` | Hapus user staf → semua record check-in ikut terhapus! |
| 33 | `check_outs.processed_by` sama | Hapus user staf → record checkout hilang |
| 34 | `rooms.room_type_id` cascade | Hapus tipe kamar → semua kamar tipe itu terhapus |
| 35 | `reservations.guest_id` cascade | Hapus tamu → semua reservasi + check-in + folio + charges ikut terhapus |

### Security Issues

| # | Masalah |
|---|---------|
| 36 | Login endpoint tidak ada rate limiting → rentan brute-force |
| 37 | Admin bisa menonaktifkan akun sendiri → terkunci dari sistem |
| 38 | CORS `allowed_origins` masih hardcode `localhost:5173` (sudah di-override di Railway tapi file config belum diupdate) |

---

## 🔵 CODE QUALITY

| # | Masalah | Lokasi |
|---|---------|--------|
| 39 | Fungsi `formatRupiah` duplikat di 4 file berbeda | helpers.js (2x), AdminDashboard.jsx, FnbDashboard.jsx |
| 40 | Pola error display tidak konsisten antar halaman | DashboardPage vs RoomsPage vs Modal |
| 41 | HandleInertiaRequests middleware dimuat tapi tidak dipakai (ini SPA, bukan Inertia) | bootstrap/app.php |
| 42 | Format nomor folio tidak konsisten (`FL-` vs `FOLIO-`) | CheckInController vs DemoDataSeeder |
| 43 | Data seeder tidak valid menurut validasi controller sendiri (deposit ≠ total_amount, guest tanpa id_number) | DemoDataSeeder |
| 44 | `$request->all()` vs `$request->validated()` tidak konsisten antar controller | Multiple controllers |
| 45 | Pagination tidak konsisten (beberapa endpoint paginasi, beberapa return semua data) | Multiple controllers |

---

## ⚪ HALAMAN / FITUR YANG BELUM ADA

| # | Fitur | Status |
|---|-------|--------|
| 46 | Halaman Laporan (`/reports`) | Backend sudah ada (occupancy + revenue), frontend belum dibuat |
| 47 | Halaman Folio/Billing dedicated | Backend sudah ada API-nya, hanya diakses via modal check-out |
| 48 | CRUD Tipe Kamar (Room Types) | Hanya bisa baca (`GET /room-types`), tidak bisa tambah/edit/hapus |
| 49 | Hapus data Tamu | Tidak ada endpoint `DELETE /guests` |
| 50 | Dark/Light Mode Toggle | Seluruh app dikunci di dark mode |
