import axios from 'axios';
import { getToken } from '../utils/token.js';

// 1. PUBLIC CLIENT (Tanpa Interceptor Token)
// Digunakan untuk API Publik (seperti berita) dan Autentikasi (login/register)
export const publicClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. PRIVATE CLIENT (Dengan Interceptor Token)
// Digunakan khusus untuk API Terproteksi yang membutuhkan otentikasi
export const privateClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==========================================
// REQUEST INTERCEPTOR (Hanya Terpasang di Private Client)
// ==========================================
privateClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // Jika token ada, sisipkan secara otomatis ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[Interceptor Request] Token ditemukan. Menyisipkan Authorization header.`);
    } else {
      console.log(`[Interceptor Request] Tidak ada token. Mengirim request tanpa Auth header.`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR (Hanya Terpasang di Private Client)
// ==========================================
privateClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tangani error response secara terpusat (Global Error Handler)
    if (error.response) {
      console.error(`[Interceptor Response] Terjadi error dengan status ${error.response.status}: ${error.response.data.message || error.message}`);
      
      // Jika status 401 Unauthorized
      if (error.response.status === 401) {
        console.warn(`[Interceptor Response] Akses ditolak (401). Token tidak valid atau kedaluwarsa.`);
      }
    } else if (error.request) {
      console.error(`[Interceptor Response] Tidak ada respon dari server. Masalah jaringan.`);
    } else {
      console.error(`[Interceptor Response] Error: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);
