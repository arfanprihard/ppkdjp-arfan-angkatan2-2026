import axios from 'axios';
import { getToken } from '../utils/token.js';

// TODO 1: Buat instance 'publicClient' menggunakan axios.create
// Konfigurasikan baseURL: 'http://localhost:3000/api'
export const publicClient = null; // Ganti null ini dengan instance axios Anda

// TODO 2: Buat instance 'privateClient' menggunakan axios.create
// Konfigurasikan baseURL: 'http://localhost:3000/api'
export const privateClient = null; // Ganti null ini dengan instance axios Anda

// ==========================================
// TODO 3: Tambahkan Request Interceptor pada 'privateClient'
// 1. Panggil getToken() untuk mengambil token.
// 2. Jika token ada, sisipkan ke header: config.headers.Authorization = `Bearer ${token}`
// 3. Jangan lupa me-return config.
// ==========================================
// privateClient.interceptors.request.use(...)


// ==========================================
// TODO 4: Tambahkan Response Interceptor pada 'privateClient'
// 1. Jika request berhasil, kembalikan response.
// 2. Jika gagal (ada error), tangani error.response.status === 401 secara khusus dengan console.warn.
// 3. Jangan lupa me-return Promise.reject(error).
// ==========================================
// privateClient.interceptors.response.use(...)
