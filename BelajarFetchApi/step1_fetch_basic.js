/**
 * STEP 1: Belajar Fetch API dari Dasar
 *
 * Fetch API adalah interface bawaan (native) JavaScript modern (ES6+)
 * untuk melakukan HTTP Request (mengambil atau mengirim data ke server) secara Asynchronous.
 * Fetch mengembalikan sebuah "Promise".
 */

// Kita menggunakan public API gratis: JSONPlaceholder untuk ujicoba.
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// ==========================================
// 1. GET REQUEST (Mengambil Data)
// ==========================================
async function getPosts() {
  console.log("--- 1. Menjalankan GET Request ---");
  try {
    // fetch() secara default melakukan method GET
    const response = await fetch(API_URL + "/1"); // Mengambil post dengan ID 1

    // HTTP status 200-299 menandakan request sukses.
    // response.ok akan bernilai true jika status berkisar di angka tersebut.
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Mengubah response body menjadi format JSON.
    // Ini juga mengembalikan Promise, jadi kita butuh 'await'.
    const data = await response.json();
    console.log("Data yang didapat:", data);
  } catch (error) {
    console.error("Terjadi kesalahan saat GET:", error.message);
  }
}

// ==========================================
// 2. POST REQUEST (Mengirim Data)
// ==========================================
async function createPost() {
  console.log("\n--- 2. Menjalankan POST Request ---");
  try {
    const newPost = {
      title: "Belajar Fetch API",
      body: "Ini adalah isi postingan baru yang dikirim via Fetch API.",
      userId: 1,
    };

    const response = await fetch(API_URL, {
      method: "POST", // Menentukan method HTTP
      headers: {
        "Content-Type": "application/json", // Memberitahu server bahwa data yang dikirim berformat JSON
      },
      body: JSON.stringify(newPost), // Mengubah object JS menjadi string JSON sebelum dikirim
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Postingan berhasil dibuat:", data);
  } catch (error) {
    console.error("Terjadi kesalahan saat POST:", error.message);
  }
}

// ==========================================
// 3. ERROR HANDLING (Menangani Error Jaringan & HTTP)
// ==========================================
async function testErrorHandling() {
  console.log("\n--- 3. Menjalankan Uji Coba Error Handling ---");

  // Kasus A: URL salah / Endpoint tidak ada (HTTP Error 404)
  try {
    console.log("Mencoba fetch ke URL yang salah...");
    const response = await fetch(API_URL + "/endpoint-yang-salah-12345");

    // CATATAN PENTING: fetch() TIDAK AKAN menganggap error 404/500 sebagai Promise Reject.
    // fetch() hanya reject jika ada gangguan jaringan (offline, CORS, salah domain).
    // Oleh karena itu, kita HARUS memeriksa response.ok secara manual!
    if (!response.ok) {
      throw new Error(`[HTTP ERROR] Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Catch menangkap error:", error.message);
  }

  // Kasus B: Gangguan Koneksi / Domain tidak ada (Network Error)
  try {
    console.log("Mencoba fetch ke domain yang tidak terdaftar...");
    await fetch("https://domain-palsu-tidak-ada-sepanjang-masa.com");
  } catch (error) {
    console.log("Catch menangkap error jaringan:", error.message);
  }
}

// ==========================================
// 4. UPDATE REQUEST (PUT & PATCH) - Menggunakan Arrow Function
// ==========================================
// PUT digunakan untuk mengganti seluruh data resource
const updatePostPUT = async (id) => {
  console.log(`\n--- 4a. Menjalankan PUT (Update Total) pada Post ID ${id} ---`);
  try {
    const updatedData = {
      id: id,
      title: 'Judul Baru (PUT)',
      body: 'Body baru yang diupdate secara keseluruhan.',
      userId: 1
    };

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData)
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();
    console.log('Hasil PUT:', data);
  } catch (error) {
    console.error('Terjadi kesalahan saat PUT:', error.message);
  }
};

// PATCH digunakan untuk meng-update sebagian data saja (partial)
const updatePostPATCH = async (id) => {
  console.log(`\n--- 4b. Menjalankan PATCH (Update Sebagian) pada Post ID ${id} ---`);
  try {
    const partialData = {
      title: 'Hanya Judul yang Diubah (PATCH)'
    };

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partialData)
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();
    console.log('Hasil PATCH:', data);
  } catch (error) {
    console.error('Terjadi kesalahan saat PATCH:', error.message);
  }
};

// ==========================================
// 5. DELETE REQUEST - Menggunakan Arrow Function
// ==========================================
const deletePost = async (id) => {
  console.log(`\n--- 5. Menjalankan DELETE pada Post ID ${id} ---`);
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    // Biasanya endpoint DELETE mengembalikan objek kosong {} atau status sukses
    const data = await response.json();
    console.log(`Post ID ${id} berhasil dihapus. Response server:`, data);
  } catch (error) {
    console.error('Terjadi kesalahan saat DELETE:', error.message);
  }
};

// Menjalankan semua demo secara berurutan
const runDemo = async () => {
  await getPosts();
  await createPost();
  await testErrorHandling();
  await updatePostPUT(1);
  await updatePostPATCH(1);
  await deletePost(1);
};

runDemo();

