/**
 * STEP 2: Belajar Axios Dasar
 *
 * Axios adalah library HTTP Client yang mengembalikan Promise.
 * Di sini kita akan mempraktekkan GET, POST, PUT/PATCH, DELETE,
 * dan penanganan error khusus menggunakan Axios.
 */

// Memasukkan library Axios yang sudah di-install
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// ==========================================
// 1. GET REQUEST (Mengambil Data)
// ==========================================
const getPost = async (id) => {
  console.log(`--- 1. GET Request (Post ID: ${id}) ---`);
  try {
    const response = await axios.get(`${API_URL}/${id}`);

    // CATATAN:
    // - Tidak perlu response.json()
    // - Data dari server berada di dalam properti 'data' pada object response
    console.log("Data dari Axios:", response.data);
  } catch (error) {
    handleAxiosError(error);
  }
};

// ==========================================
// 2. POST REQUEST (Mengirim Data)
// ==========================================
const createPost = async () => {
  console.log("\n--- 2. POST Request (Membuat Post Baru) ---");
  try {
    const newPost = {
      title: "Belajar Axios",
      body: "Mengirim data menggunakan Axios sangat praktis.",
      userId: 1,
    };

    // CATATAN:
    // - Kita tidak perlu JSON.stringify()
    // - Kita tidak perlu setting header Content-Type secara manual, Axios otomatis mendeteksinya!
    const response = await axios.post(API_URL, newPost);

    console.log("Hasil POST:", response.data);
  } catch (error) {
    handleAxiosError(error);
  }
};

// ==========================================
// 3. UPDATE REQUEST (PUT vs PATCH)
// ==========================================
const updatePost = async (id) => {
  console.log(`\n--- 3. UPDATE Request (PUT vs PATCH) ---`);
  try {
    // A. PUT (Mengganti seluruh data)
    const putResponse = await axios.put(`${API_URL}/${id}`, {
      title: "Judul Baru PUT",
      // Field body & userId akan dianggap hilang/null di server karena tidak dikirim
    });
    console.log("Hasil PUT:", putResponse.data);

    // B. PATCH (Mengubah sebagian data saja)
    const patchResponse = await axios.patch(`${API_URL}/${id}`, {
      title: "Judul Baru PATCH",
      // Field body & userId yang ada di server tetap utuh
    });
    console.log("Hasil PATCH:", patchResponse.data);
  } catch (error) {
    handleAxiosError(error);
  }
};

// ==========================================
// 4. DELETE REQUEST (Menghapus Data)
// ==========================================
const deletePost = async (id) => {
  console.log(`\n--- 4. DELETE Request (Hapus Post ID: ${id}) ---`);
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log(`Post ID ${id} berhasil dihapus. Response:`, response.data);
  } catch (error) {
    handleAxiosError(error);
  }
};

// ==========================================
// 5. PENANGANAN ERROR SPESIFIK AXIOS
// ==========================================
const testErrorHandling = async () => {
  console.log("\n--- 5. Uji Coba Error Handling Axios ---");
  try {
    // Mencoba fetch ke URL yang salah (HTTP 404)
    // Axios akan mendeteksi status 404 lalu otomatis melempar ke blok catch!
    await axios.get(`${API_URL}/endpoint-salah-123`);
  } catch (error) {
    handleAxiosError(error);
  }
};

// Helper function untuk membedakan tipe error di Axios
const handleAxiosError = (error) => {
  if (error.response) {
    // Kasus A: Server merespons dengan status code di luar range 2xx (misal 404, 500)
    console.error(`[HTTP Error] Status: ${error.response.status}`);
    console.error("Data Error dari Server:", error.response.data);
  } else if (error.request) {
    // Kasus B: Request berhasil dibuat tapi tidak ada respons dari server (misal offline)
    console.error(
      "[Network Error] Tidak ada respon dari server. Periksa koneksi Anda!",
    );
  } else {
    // Kasus C: Terjadi kesalahan saat menyusun request di JavaScript
    console.error("[App Error] Pesan:", error.message);
  }
};

// Menjalankan semua fungsi demo
const run = async () => {
  await getPost(1);
  await createPost();
  await updatePost(1);
  await deletePost(1);
  await testErrorHandling();
};

run();
