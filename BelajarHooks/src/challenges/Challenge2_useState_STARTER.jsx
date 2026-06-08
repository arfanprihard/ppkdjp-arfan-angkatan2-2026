import React, { useState, useEffect, useCallback } from 'react';

/**
 * 🌐 TANTANGAN 2: useEffect - Data Fetching Dashboard
 *
 * API yang bisa kamu gunakan:
 *   https://jsonplaceholder.typicode.com/users   ← daftar 10 user
 *   https://jsonplaceholder.typicode.com/posts   ← daftar 100 post
 *
 * Ketentuan Penilaian:
 * 1. Fungsionalitas (40%): Fetch, loading, error, auto-refresh, cleanup
 * 2. Code Quality (30%): Clean code, naming yang jelas
 * 3. Penggunaan Hook (20%): useEffect dengan deps & cleanup yang benar
 * 4. Kreativitas (10%): Pagination, search, skeleton loading, dll
 *
 * ═══════════════════════════════════════
 * LANGKAH PENGERJAAN:
 * ═══════════════════════════════════════
 *
 * STEP 1 — Definisikan state
 *   - data hasil fetch
 *   - loading (boolean)
 *   - error (string/null)
 *   - search (untuk filter)
 *
 * STEP 2 — Buat fungsi fetchData() dengan cancelled flag
 *   ⚠️ PENTING: gunakan `let cancelled = false` untuk mencegah
 *   race condition (setState setelah komponen unmount)
 *
 * STEP 3 — Gunakan useEffect untuk:
 *   (a) Fetch data pertama kali saat mount → deps: []
 *   (b) Auto-refresh setiap 30 detik → setInterval + clearInterval
 *
 * STEP 4 — Filter data dari hasil fetch (tanpa fetch ulang)
 *
 * STEP 5 — Render UI:
 *   - Tampilkan loading indicator saat fetching
 *   - Tampilkan pesan error yang user-friendly
 *   - Tampilkan list/grid data
 *   - Input search untuk filter
 *   - Tombol manual refresh
 *
 * BONUS (nilai tambah):
 *   - Skeleton loading cards
 *   - Pagination
 *   - Countdown timer auto-refresh
 *   - Animasi / transisi
 */

export default function Challenge2_useEffect() {
  // ─── STEP 1: Definisikan state di sini ───
  // const [data, setData] = useState([])
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState(null)
  // const [search, setSearch] = useState('')


  // ─── STEP 2: Buat fungsi fetch dengan cancelled flag ───
  // const fetchData = useCallback(() => {
  //   setLoading(true)
  //   setError(null)
  //
  //   let cancelled = false    // ← mencegah race condition
  //
  //   fetch('https://jsonplaceholder.typicode.com/users')
  //     .then(res => {
  //       if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
  //       return res.json()
  //     })
  //     .then(result => {
  //       if (!cancelled) {     // ← cek sebelum setState
  //         setData(result)
  //         setLoading(false)
  //       }
  //     })
  //     .catch(err => {
  //       if (!cancelled) {
  //         setError(err.message)
  //         setLoading(false)
  //       }
  //     })
  //
  //   return () => { cancelled = true }  // ← return cleanup!
  // }, [])


  // ─── STEP 3a: Fetch saat pertama kali mount ───
  // useEffect(() => {
  //   const cleanup = fetchData()
  //   return cleanup
  // }, [fetchData])


  // ─── STEP 3b: Auto-refresh setiap 30 detik ───
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     fetchData()
  //   }, 30000)
  //
  //   return () => clearInterval(timer)  // ← cleanup interval!
  // }, [fetchData])


  // ─── STEP 4: Filter data berdasarkan search ───
  // const filtered = data.filter(item =>
  //   item.name.toLowerCase().includes(search.toLowerCase())
  // )


  // ─── STEP 5: Render UI ───
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <h2>🌐 Tantangan 2: Data Fetching Dashboard</h2>
      <p style={{ color: '#aaa', fontSize: '14px' }}>
        Tulis kode kamu di file <code>src/challenges/Challenge2_useEffect.jsx</code>.
        Hasil perubahan akan otomatis ter-update di sini!
      </p>

      {/* --- MULAI CODING DI BAWAH INI --- */}

      {/* Tombol Refresh */}
      {/* <button onClick={fetchData}>🔄 Refresh</button> */}

      {/* Input Search */}
      {/* <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Cari..."
      /> */}

      {/* Loading State */}
      {/* {loading && <p>⏳ Loading...</p>} */}

      {/* Error State */}
      {/* {error && <p style={{ color: 'red' }}>❌ {error}</p>} */}

      {/* Data List */}
      {/* {filtered.map(item => (
        <div key={item.id}>
          <strong>{item.name}</strong>
          <p>{item.email}</p>
        </div>
      ))} */}

      <div style={{ background: '#1e1e30', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
        <p style={{ textAlign: 'center', color: '#777' }}>
          Hapus placeholder ini dan buat Data Fetching Dashboard kamu sendiri!
        </p>
        <p style={{ textAlign: 'center', color: '#555', fontSize: '13px' }}>
          Baca komentar di atas untuk panduan step-by-step 👆
        </p>
      </div>

      {/* --- SELESAI CODING --- */}
    </div>
  );
}
