import { publicClient } from './client.js';

/**
 * Mengirim request login ke backend
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<object>} Data respon dari server (message, token)
 */
export const loginAPI = async (username, password) => {
  const response = await publicClient.post('/login', { username, password });
  return response.data;
};
