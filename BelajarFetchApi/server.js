/**
 * MOCK SERVER BACKEND - EXPRESS.JS & JWT
 * 
 * Server ini digunakan untuk mensimulasikan login, pembuatan token JWT,
 * dan pengecekan token pada endpoint terproteksi (privat).
 * 
 * Karena package.json kita bertipe "module", kita menggunakan sintaks import.
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Kunci rahasia (Secret Key) untuk tanda tangan JWT.
// Di dunia nyata, ini disimpan sangat rapat di environment variable (.env)
const SECRET_KEY = "kunci_rahasia_developer_123_abc";

// Middleware
app.use(cors()); // Mengizinkan request dari frontend mana saja (CORS)
app.use(express.json()); // Membaca body request berformat JSON

// Mock database user sederhana
const MOCK_USER = {
  username: "arfan",
  password: "password123",
  fullName: "Arfan Prihardi",
  role: "Lead Developer"
};

// ==========================================
// 1. ENDPOINT LOGIN (Public)
// ==========================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  console.log(`[Server] Menerima request login untuk: ${username}`);

  // Cek apakah username dan password cocok
  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    
    // Data yang akan disimpan di dalam Token (Payload)
    // Jangan simpan password di sini!
    const payload = {
      username: MOCK_USER.username,
      fullName: MOCK_USER.fullName,
      role: MOCK_USER.role
    };

    // Membuat JWT Token
    // jwt.sign(payload, secretKey, options)
    // expiresIn: '1h' artinya token ini akan otomatis kedaluwarsa dalam 1 jam
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    console.log(`[Server] Login berhasil. Token dibuat!`);
    
    return res.status(200).json({
      message: "Login berhasil!",
      token: token
    });
  }

  // Jika password salah
  console.log(`[Server] Login gagal. Password salah.`);
  return res.status(401).json({
    message: "Username atau password salah!"
  });
});

// ==========================================
// 2. ENDPOINT PROFILE (Protected / Terproteksi JWT)
// ==========================================
app.get('/api/profile', (req, res) => {
  // Mengambil header 'Authorization'
  const authHeader = req.headers['authorization'];

  console.log(`[Server] Menerima request ke /api/profile`);
  console.log(`[Server] Header Authorization:`, authHeader);

  // Format header Authorization yang benar adalah: Bearer <JWT_TOKEN>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log(`[Server] Token tidak ada atau salah format.`);
    return res.status(401).json({
      message: "Akses ditolak! Token tidak disertakan atau salah format."
    });
  }

  // Mengambil token asli (memisahkan kata 'Bearer ' dengan tokennya)
  const token = authHeader.split(' ')[1];

  // Verifikasi keaslian token
  jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
    if (err) {
      console.log(`[Server] Token tidak valid atau kedaluwarsa.`);
      return res.status(403).json({
        message: "Token tidak valid atau sudah kedaluwarsa!"
      });
    }

    // Jika token valid, decodedUser akan berisi payload asli kita
    console.log(`[Server] Token valid! Mengembalikan data profil user: ${decodedUser.fullName}`);
    
    return res.status(200).json({
      message: "Data profil berhasil diambil!",
      userProfile: {
        username: decodedUser.username,
        fullName: decodedUser.fullName,
        role: decodedUser.role
      }
    });
  });
});

// ==========================================
// 3. ENDPOINT NEWS (Public / Bebas Akses Tanpa Token)
// ==========================================
app.get('/api/news', (req, res) => {
  console.log(`[Server] Menerima request ke /api/news (Public)`);
  
  const mockNews = [
    { id: 1, title: "Belajar Axios Interceptor", category: "Edukasi", date: "17 Juni 2026" },
    { id: 2, title: "Mengapa Perusahaan Menggunakan JWT?", category: "Teknologi", date: "16 Juni 2026" },
    { id: 3, title: "Tips Menulis Kode Bersih (Clean Code)", category: "Karir", date: "15 Juni 2026" }
  ];

  return res.status(200).json({
    message: "Berita berhasil diambil secara publik!",
    news: mockNews
  });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`Mock Server JWT berjalan di http://localhost:${PORT}`);
  console.log(`===================================================`);
});
