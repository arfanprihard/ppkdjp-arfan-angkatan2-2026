/**
 * Mengambil token dari localStorage browser
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Menyimpan token ke localStorage browser
 * @param {string} token 
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Menghapus token dari localStorage browser
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};
