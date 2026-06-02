import React, { useState } from 'react';

/**
 * 📝 TANTANGAN 1: useState - Todo App dengan Filter & Sorting
 * 
 * Ketentuan Penilaian:
 * 1. Fungsionalitas (40%): Tambah, hapus, toggle done, filter, sorting, counter.
 * 2. Code Quality (30%): Clean code, descriptive naming, component structure.
 * 3. Penggunaan Hook (20%): Penggunaan useState & updater function secara tepat.
 * 4. Kreativitas (10%): Fitur tambahan seperti edit inline, localStorage, dll.
 */

export default function Challenge1_useState() {
  // 1. Definisikan state kamu di sini (todos, input text, filter, sort)
  // Contoh: const [todos, setTodos] = useState([]);

  // 2. Buat fungsi untuk handle tambah todo
  
  // 3. Buat fungsi untuk handle delete todo
  
  // 4. Buat fungsi untuk handle toggle status todo (done/undone)

  // 5. Buat logic untuk filter dan sorting todo sebelum di-render

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <h2>📝 Tantangan 1: Todo App Saya</h2>
      <p style={{ color: '#aaa', fontSize: '14px' }}>
        Tulis kode kamu di file <code>src/challenges/Challenge1_useState.jsx</code>. 
        Hasil perubahan akan otomatis ter-update di sini!
      </p>

      {/* --- MULAI CODING DI BAWAH INI --- */}

      <div style={{ background: '#1e1e30', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
        <p style={{ textAlign: 'center', color: '#777' }}>
          Hapus placeholder ini dan buat Todo App kamu sendiri!
        </p>
      </div>

      {/* --- SELESAI CODING --- */}
    </div>
  );
}
