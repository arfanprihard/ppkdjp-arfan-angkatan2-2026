import { publicClient } from './client.js';

/**
 * Mengambil daftar berita publik dari backend (tanpa token)
 * @returns {Promise<object>} Data respon dari server berisi daftar berita
 */
export const getNewsAPI = async () => {
  const response = await publicClient.get('/news');
  return response.data;
};
