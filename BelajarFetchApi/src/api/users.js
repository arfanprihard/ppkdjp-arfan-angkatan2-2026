import { privateClient } from './client.js';

/**
 * Mengambil data profil user yang terproteksi oleh JWT
 * @returns {Promise<object>} Data profil user dari server
 */
export const getProfileAPI = async () => {
  const response = await privateClient.get('/profile');
  return response.data;
};
