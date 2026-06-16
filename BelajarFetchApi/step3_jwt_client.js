/**
 * STEP 3: Client JWT Auth menggunakan Axios
 * 
 * Script ini mendemonstrasikan bagaimana client (Frontend) melakukan:
 * 1. Request login ke server untuk mendapatkan JWT Token.
 * 2. Menyimpan token tersebut.
 * 3. Menggunakan token tersebut untuk mengakses API terproteksi.
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Variabel untuk menyimpan token setelah login (simulasi localStorage/state)
let savedToken = null;

// ==========================================
// 1. UJI COBA AKSES PROFILE TANPA TOKEN (Pasti Gagal)
// ==========================================
const getProfileWithoutToken = async () => {
  console.log('\n--- Uji Coba 1: Akses Profil tanpa Token ---');
  try {
    const response = await axios.get(`${BASE_URL}/profile`);
    console.log('Respon sukses:', response.data);
  } catch (error) {
    if (error.response) {
      console.log(`[SUKSES MEMPROTES] Server menolak akses dengan status: ${error.response.status}`);
      console.log('Pesan dari server:', error.response.data.message);
    } else {
      console.error('Error jaringan:', error.message);
    }
  }
};

// ==========================================
// 2. PROSES LOGIN UNTUK MENDAPATKAN TOKEN
// ==========================================
const login = async (username, password) => {
  console.log('\n--- Uji Coba 2: Melakukan Proses Login ---');
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      username: username,
      password: password
    });

    console.log('Login Sukses! Respon server:', response.data.message);
    
    // Menyimpan token JWT yang diberikan oleh server
    savedToken = response.data.token;
    console.log('Token berhasil disimpan:', savedToken.substring(0, 30) + '...');
  } catch (error) {
    if (error.response) {
      console.error('Login Gagal! Pesan server:', error.response.data.message);
    } else {
      console.error('Error jaringan:', error.message);
    }
  }
};

// ==========================================
// 3. AKSES PROFILE DENGAN MELAMPIRKAN TOKEN (Pasti Berhasil)
// ==========================================
const getProfileWithToken = async () => {
  console.log('\n--- Uji Coba 3: Akses Profil menggunakan JWT Token ---');
  try {
    // Kita harus menyisipkan header Authorization: Bearer <token>
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${savedToken}`
      }
    });

    console.log('Akses Diterima! Data Profil Anda:');
    console.log(response.data.userProfile);
  } catch (error) {
    if (error.response) {
      console.error('Akses Ditolak! Pesan server:', error.response.data.message);
    } else {
      console.error('Error jaringan:', error.message);
    }
  }
};

// Alur Eksekusi Simulasi
const runSimulasi = async () => {
  // A. Coba akses data privat sebelum login
  await getProfileWithoutToken();

  // B. Login dengan kredensial yang salah (uji coba error handling)
  console.log('\nMencoba login dengan password ngawur...');
  await login('arfan', 'salah_password');

  // C. Login dengan kredensial yang benar
  await login('arfan', 'password123');

  // D. Akses data privat setelah login (menggunakan token)
  if (savedToken) {
    await getProfileWithToken();
  }
};

runSimulasi();
