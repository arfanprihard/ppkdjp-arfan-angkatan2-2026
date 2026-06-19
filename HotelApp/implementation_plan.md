# 🛠️ Implementation Plan — QA Bug Fixes & Improvements

Berdasarkan hasil QA Audit yang menemukan **85 issue**, berikut adalah rencana perbaikan yang diprioritaskan.

> [!IMPORTANT]
> **Strategi:** Perbaikan dibagi menjadi 4 fase berdasarkan severity. Fase 1 & 2 adalah **wajib** (bugs yang bisa menyebabkan data rusak/crash). Fase 3 & 4 bersifat **enhancement** (peningkatan kualitas).

---

## Fase 1 — Critical Bug Fixes 🔴
**Estimasi:** ~30 menit | **Prioritas:** WAJIB

### Backend Fixes

#### [MODIFY] [ReservationController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/ReservationController.php)
- Fix `update()`: Tambahkan `$validated['total_amount'] = $reservation->total_amount;` sebelum `$reservation->update($validated)` agar total harga yang sudah dihitung ulang tidak tertimpa.

#### [MODIFY] [CheckInController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/CheckInController.php)
- Fix folio race condition: Tambahkan `$folio->refresh()` setelah setiap `increment()` / `decrement()` sebelum menghitung balance.

#### [MODIFY] [FnbOrderController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/FnbOrderController.php)
- Fix folio race condition (sama seperti di atas).

#### [MODIFY] [FolioController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/FolioController.php)
- Fix folio race condition pada `addCharge()` dan `settle()`.

#### [MODIFY] [LaundryController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/LaundryController.php)
- Fix folio race condition.
- Fix mass assignment: Ganti `$request->all()` → `$request->validated()`.

#### [MODIFY] [HousekeepingController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/HousekeepingController.php)
- Fix mass assignment: Ganti `$request->all()` → `$request->validated()`.

#### [MODIFY] [FnbOrderItem.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Models/FnbOrderItem.php)
- Fix foreign key: `return $this->belongsTo(FnbOrder::class, 'order_id');`

### Frontend Fixes

#### [MODIFY] [ReservationsPage.jsx](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/frontend/src/pages/ReservationsPage.jsx)
- Kirim parameter `search` ke backend API call (saat ini hanya client-side filtering).

#### [MODIFY] [GuestsPage.jsx](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/frontend/src/pages/GuestsPage.jsx)
- Tambahkan debounce (300ms) pada pencarian agar tidak mengirim API call setiap ketikan.

#### [MODIFY] CheckOutModal.jsx
- Tambahkan class `bg-zinc-950` pada textarea feedback.

---

## Fase 2 — Business Logic Fixes 🟠
**Estimasi:** ~45 menit | **Prioritas:** WAJIB

#### [MODIFY] [CheckOutController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/CheckOutController.php)
- Tambahkan validasi untuk mencegah double checkout.
- Tambahkan validasi bahwa status reservasi masih `checked_in`.

#### [MODIFY] [FnbOrderController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/FnbOrderController.php)
- Enforce forward-only status transition (`pending` → `proses` → `selesai`).
- Return error jika `charge_to === 'room'` tapi tidak ada folio aktif.

#### [MODIFY] [LaundryController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/LaundryController.php)
- Enforce forward-only status transition.
- Return error jika charge ke kamar gagal (tidak ada folio aktif).

#### [MODIFY] [ReservationController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/ReservationController.php)
- Tambahkan lock/retry mechanism pada pembuatan kode reservasi untuk mencegah duplikat.

#### [MODIFY] [api.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/routes/api.php)
- Fix: Tambahkan role `receptionist` ke route `GET /fnb/orders` agar tidak 403.

#### [MODIFY] AdminDashboard.jsx
- Ubah link "Laporan Keuangan" ke `/dashboard` atau sembunyikan sampai halaman Reports dibuat.

#### [MODIFY] [ReportController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/ReportController.php)
- Fix occupancy query: Gunakan data CheckIn/Reservation historis per tanggal, bukan status kamar saat ini.

---

## Fase 3 — UI/UX & Database Hardening 🟡
**Estimasi:** ~1.5 jam | **Prioritas:** DISARANKAN

### Database Migrations

#### [NEW] Migration: add_indexes_and_fix_constraints
- Tambahkan `unique()` index pada `guests.id_number` dan `guests.email`.
- Tambahkan index pada kolom yang sering di-filter: `reservations.status`, `rooms.status`, `fnb_orders.status`, `housekeeping_tasks.status`.
- Ubah `onDelete('cascade')` → `onDelete('restrict')` atau `onDelete('set null')` pada:
  - `check_ins.processed_by`
  - `check_outs.processed_by`
  - `rooms.room_type_id`
  - `reservations.guest_id`

### Security

#### [MODIFY] [api.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/routes/api.php)
- Tambahkan `throttle:5,1` pada route login untuk mencegah brute-force.

#### [MODIFY] [UserController.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/app/Http/Controllers/UserController.php)
- Tambahkan validasi agar admin tidak bisa menonaktifkan akun sendiri.

### UI/UX Improvements

#### [NEW] `frontend/src/hooks/useKeyboard.js`
- Buat custom hook untuk menangani ESC key pada semua modal.

#### [MODIFY] Semua Modal Components
- Tambahkan ESC key listener menggunakan custom hook baru.

#### [MODIFY] Sidebar.jsx
- Simpan state collapse ke `localStorage`.

#### [MODIFY] UsersPage.jsx, HousekeepingPage.jsx, ReservationDetailModal.jsx
- Fix invalid Tailwind classes (`rose-450` → `rose-400`, `amber-550` → `amber-500`, `duration-255` → `duration-200`).

#### [MODIFY] LoginPage.jsx
- Tambahkan `htmlFor` pada semua `<label>`.
- Tambahkan loading state saat pengecekan session awal.

### Code Quality

#### [NEW] `frontend/src/utils/format.js`
- Buat utility file tunggal untuk `formatRupiah()` dan fungsi format lainnya.
- Refactor semua file yang menduplikasi fungsi ini.

#### [MODIFY] [bootstrap/app.php](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/backend/bootstrap/app.php)
- Hapus `HandleInertiaRequests::class` dari middleware web (tidak dipakai di SPA).

---

## Fase 4 — Missing Features ⚪
**Estimasi:** ~2-3 jam | **Prioritas:** OPSIONAL

#### [NEW] `frontend/src/pages/ReportsPage.jsx`
- Buat halaman Laporan (`/reports`) dengan 2 tab:
  - **Occupancy Report:** Grafik line chart okupansi 30 hari.
  - **Revenue Report:** Grafik bar chart pendapatan bulanan.
- Gunakan library **Recharts** untuk visualisasi.

#### [MODIFY] [App.jsx](file:///c:/xampp/htdocs/angkatan2-2026/http-angkatan2-2026/HotelApp/frontend/src/App.jsx)
- Tambahkan route `/reports` ke routing React.

#### Backend — Room Types CRUD
- Tambahkan method `store()`, `update()`, `destroy()` ke RoomTypeController (atau buat baru).
- Tambahkan routes di `api.php`.

#### Sidebar — Mobile Responsive
- Tambahkan hamburger menu untuk layar mobile.
- Overlay backdrop saat sidebar terbuka di mobile.

---

## Verification Plan

### Automated Tests
```powershell
# Build frontend untuk memastikan tidak ada compilation error
npm run build --prefix frontend
```

### Manual Verification
1. Test login → pastikan session tetap bertahan (tidak redirect kembali ke login).
2. Test buat reservasi → edit → pastikan `total_amount` berubah benar.
3. Test check-in → pastikan folio balance akurat.
4. Test F&B order dengan `charge_to: room` → pastikan muncul di folio.
5. Test checkout → pastikan tidak bisa double checkout.
6. Test pencarian di halaman Reservasi → pastikan bisa menemukan data di semua halaman.
7. Tekan ESC di semua modal → pastikan tertutup.

---

## Open Questions

> [!IMPORTANT]
> **Pertanyaan untuk User:**
> 1. Apakah Anda ingin saya mengerjakan **semua 4 fase** sekaligus, atau mulai dari **Fase 1 & 2** (critical fixes) dulu?
> 2. Apakah Anda ingin halaman **Laporan (Reports)** dengan grafik/chart dibuatkan di Fase 4?
> 3. Apakah fitur **Light/Dark Mode Toggle** perlu ditambahkan?
