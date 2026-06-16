# 📝 Laporan Progress Belajar & Rencana Lanjutan (Handoff Document)

Dokumen ini ditujukan untuk **AI Coding Assistant** di komputer kampus agar mengetahui sejauh mana proses belajar Anda dan bagaimana melanjutkannya secara runut.

---

## 👥 Profil Pengguna & Lingkungan
* **Nama**: Arfan Prihardi
* **Topik**: Pembelajaran API Integration (Fetch, Axios, JWT, Arsitektur Enterprise)
* **Status**: Sedang bermigrasi dari komputer rumah ke komputer kampus.
* **Lingkungan Workspace**: Node.js (dengan konfigurasi ES Modules `"type": "module"` di `package.json`).

---

##  Status Pembelajaran (Progress)

###  Step 1: Dasar Fetch API (Native JS) — [SELESAI]
* **Materi yang sudah dikuasai**:
  * Konsep HTTP Request (GET, POST, PUT, PATCH, DELETE).
  * Penulisan `async/await` menggunakan Arrow Function.
  * Penanganan error manual (`response.ok`) karena Fetch tidak menganggap HTTP error 404/500 sebagai Promise reject.
  * Pemahaman tentang header `Content-Type` (dan fakta bahwa tidak perlu `; charset=UTF-8` di API modern).
* **File bukti praktik**: `step1_fetch_basic.js`, `step1_coba.js`, `index.html`.

###  Step 2: Migrasi ke Axios — [SELESAI]
* **Materi yang sudah dikuasai**:
  * Kelebihan Axios dibanding Fetch (Auto JSON parsing & stringify, auto header detection).
  * Struktur error handling Axios (`error.response` untuk error server 4xx/5xx, `error.request` untuk error jaringan).
  * Perbedaan CommonJS (`require`) dan ES Modules (`import`). Konfigurasi `"type": "module"` di `package.json`.
* **File bukti praktik**: `step2_axios_basic.js`, `step2_coba.js`.

###  Step 3: Konsep JWT (JSON Web Token) — [SELESAI]
* **Materi yang sudah dikuasai**:
  * Teori struktur JWT: Header, Payload (Base64, tidak boleh diisi data sensitif), dan Signature (Secret Key).
  * Alur Autentikasi JWT: Login ➡️ Dapatkan Token ➡️ Simpan Token ➡️ Kirim via Header `Authorization: Bearer <token>`.
  * Perbedaan JWT (Stateless) dengan Laravel Sanctum (Stateful / tersimpan di DB).
  * Cara kerja pemantauan web (Google Analytics, Morgan Logger, APM, Nginx Gateway).
  * Praktik menggunakan Express mock server lokal dan Axios client simulator.
* **File bukti praktik**: `server.js` (Express Server), `step3_jwt_client.js` (Client Simulator).

---

## 📅 Rencana Langkah Selanjutnya (Materi Berikutnya)

### **Step 4: Arsitektur API Standard Perusahaan (Enterprise-grade)**
Ini adalah materi terakhir yang harus diajarkan kepada pengguna. Silakan pandu pengguna step-by-step untuk membuat struktur kode standar industri:

1. **Struktur Folder Modular**:
   Ajarkan pengguna menyusun file API client seperti di startup/perusahaan besar:
   ```text
   src/
   ├── api/
   │   ├── client.js       # Konfigurasi Axios Instance & Interceptors
   │   ├── auth.js         # Endpoint khusus autentikasi (Login, Register, dll)
   │   └── users.js        # Endpoint khusus data user
   ├── utils/
   │   └── token.js        # Helper untuk get/set token di localStorage
   └── main.js             # Aplikasi utama (UI/Logika bisnis)
   ```
2. **Axios Instance**:
   Cara membuat custom Axios Client dengan konfigurasi `baseURL` dan `headers` default agar tidak menulis berulang-ulang.
3. **Axios Interceptors**:
   * **Request Interceptor**: Otomatis mengambil token dari `localStorage` dan menyisipkannya ke header `Authorization` setiap kali ada request keluar.
   * **Response Interceptor**: Menangkap error secara global (misal jika status `401 Unauthorized` karena token kedaluwarsa, otomatis melakukan redirect ke login atau menjalankan silent refresh token).
4. **Repository / Service Pattern**:
   Memisahkan fungsi request API ke dalam file terpisah agar kode di bagian tampilan (UI) menjadi sangat bersih (tidak ada lagi pemanggilan `axios` langsung di file UI).

---

## 🤖 Panduan untuk AI Selanjutnya (Kampus)
1. Baca file ini untuk memahami pencapaian belajar Arfan.
2. Sapa Arfan dan konfirmasikan bahwa Anda siap melanjutkan materi langsung ke **Step 4: Arsitektur API Perusahaan**.
3. Pandu Arfan secara bertahap (jangan langsung menulis semua kode sekaligus). Mulai dengan mendesain struktur folder, membuat Axios Instance, menyusun Interceptor, dan terakhir mengimplementasikannya di script utama.
