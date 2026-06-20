# PPKD Hotel - Sistem Informasi Manajemen Hotel

Sistem Informasi Manajemen Hotel (**PPKD Hotel**) adalah aplikasi berbasis web modern yang dirancang untuk mengelola operasional hotel secara terintegrasi. Proyek ini memisahkan arsitektur antara **Frontend** (Single Page Application menggunakan React & Vite) dan **Backend** (RESTful API menggunakan Laravel).

---

## 🚀 Fitur Utama Aplikasi

### 1. 🔑 Autentikasi & Manajemen Staf
* Login aman untuk staf berdasarkan peran masing-masing.
* Manajemen akun staf (Admin, Resepsionis, Housekeeping, dan F&B Service).
* Blokir akun/nonaktifkan akun staf dengan validasi keamanan.

### 2. 🛏️ Front Office & Resepsionis
* **Reservasi Tamu**: Pembuatan reservasi baru secara Walk-in, OTA (Online Travel Agent), Website, Email, atau Telepon.
* **Proses Check-in**:
  * Pemilihan kamar fisik yang siap huni (berstatus *Vacant Clean* / VC).
  * Penginputan **Uang Jaminan (Security Deposit)** terpisah dari biaya kamar.
  * Pembuatan **Guest Folio** (lembar tagihan) secara otomatis.
* **Proses Check-out (2-Step Interaktif)**:
  * **Langkah 1 (Inspeksi Kamar)**: Memicu tugas inspeksi kamar otomatis oleh divisi Housekeeping.
  * **Langkah 2 (Penyelesaian Pembayaran & Deposit)**: Menampilkan rincian tagihan (termasuk denda kerusakan dari Housekeeping), kalkulasi sisa deposit yang harus dikembalikan (*refund*), rating kepuasan, dan opsi cetak invoice.

### 3. 🧹 Housekeeping
* **Board Status Kamar**: Pemantauan visual status kamar secara real-time (VC, VD, OC, OD, OOO, OOS).
* **Manajemen Tugas**: Pembagian tugas kebersihan (*room cleaning*), inspeksi (*room inspection*), perawatan mendalam (*deep clean*), area umum, dan kolam renang.
* **Laporan Kerusakan**: Pencatatan barang rusak/hilang saat inspeksi kamar check-out, yang secara otomatis masuk sebagai biaya tambahan pada Guest Folio tamu.

### 4. 🍽️ Food & Beverage (F&B)
* Katalog menu makanan dan minuman.
* Pemesanan menu untuk Restoran maupun *Room Service* (diantar ke kamar).
* Opsi pembebanan biaya langsung ke kamar (*charge to room*) atau bayar tunai/kartu.
* Pelacakan status pengiriman hidangan (*proses* / *selesai*).

### 5. 🧺 Laundry Service
* Pencatatan permintaan laundry dari kamar tamu.
* Perhitungan biaya otomatis berdasarkan jumlah pakaian.
* Pelacakan status laundry (*received*, *processing*, *done*, *delivered*).

### 6. 📊 Dashboard & Laporan
* **Dashboard Admin**: Ringkasan tingkat hunian kamar (*occupancy rate*), grafik pendapatan bulanan interaktif, dan total reservasi.
* **Dashboard Divisi**: Statistik antrian kerja yang relevan untuk Resepsionis, Housekeeping, dan F&B.
* **Laporan Harian Divisi**: Rekapitulasi aktivitas harian staf yang dapat dicetak langsung ke PDF resmi internal hotel.

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Single Page Application (SPA) |
| | **Vite** | Build tool super cepat untuk frontend |
| | **Vanilla CSS** | Desain kustom, responsif, dan dinamis |
| | **Lucide Icons** | Library ikon modern dan konsisten |
| **Backend** | **Laravel 11+** | RESTful API & Business Logic |
| | **Sanctum** | Autentikasi API berbasis token |
| | **Carbon** | Manipulasi tanggal dan waktu |
| **Database** | **MySQL** | Penyimpanan data relasional |

---

## 📁 Struktur Direktori Proyek

```text
HotelApp/
├── backend/            # Aplikasi Laravel (RESTful API)
│   ├── app/            # Controller, Model, Middleware
│   ├── database/       # Migrasi tabel & Seeders data demo
│   ├── routes/         # Endpoint API (api.php)
│   └── tests/          # Pengujian otomatis (Pest/PHPUnit)
├── frontend/           # Aplikasi React (Vite)
│   ├── src/
│   │   ├── api/        # Konfigurasi Axios
│   │   ├── components/ # Komponen UI modular
│   │   ├── contexts/   # Auth Context & State Global
│   │   └── pages/      # Halaman dashboard & menu utama
│   └── package.json    # Dependency frontend
└── README.md           # Dokumentasi proyek (File Ini)
```

---

## 💻 Panduan Menjalankan Proyek Secara Lokal

### Prasyarat System
* PHP >= 8.2 (Sangat disarankan PHP 8.3/8.4)
* Composer terinstal
* Node.js >= 18 (dengan npm)
* Database MySQL (XAMPP/Laragon)

---

### Langkah 1: Setup Backend (Laravel)

1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Install package dependency menggunakan Composer:
   ```bash
   composer install
   ```
3. Salin file konfigurasi `.env`:
   ```bash
   cp .env.example .env
   ```
4. Buat database baru bernama **`hotel_app`** melalui phpMyAdmin atau MySQL CLI.
5. Sesuaikan konfigurasi database pada file `.env` Anda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hotel_app
   DB_USERNAME=root
   DB_PASSWORD=
   ```
6. Generate application key:
   ```bash
   php artisan key:generate
   ```
7. Jalankan migrasi tabel database beserta data demo bawaan (seeder):
   ```bash
   php artisan migrate --seed
   ```
8. Jalankan server lokal Laravel:
   ```bash
   php artisan serve
   ```
   *Backend secara default akan berjalan di alamat `http://127.0.0.1:8000`*

---

### Langkah 2: Setup Frontend (React)

1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Install package dependency menggunakan NPM:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder `frontend` dan isikan URL API Backend:
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```
4. Jalankan aplikasi frontend dalam mode development:
   ```bash
   npm run dev
   ```
   *Frontend secara default akan berjalan di alamat `http://localhost:5173`*

---

## 🧪 Akun Demo Uji Coba

Gunakan akun staf bawaan seeder berikut untuk melakukan uji coba sistem:

| Role / Divisi | Email Login | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@hotel.com` | `password` |
| **Resepsionis** | `receptionist@hotel.com` | `password` |
| **Housekeeping** | `housekeeping@hotel.com` | `password` |
| **F&B Service** | `fnb@hotel.com` | `password` |

---

## 🌐 Informasi Deployment Production

* **Frontend**: Di-deploy pada layanan **Netlify**.
* **Backend & Database**: Di-deploy pada layanan **Railway**.
* **PENTING saat Deploy**: Pastikan untuk selalu menjalankan `php artisan migrate --force` pada Railway apabila terdapat perubahan atau penambahan migrasi database terbaru.
