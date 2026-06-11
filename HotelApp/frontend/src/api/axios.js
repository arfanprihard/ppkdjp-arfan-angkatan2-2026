import axios from "axios";

// Membuat instance Axios mengarah ke base URL utama Laravel (http://localhost:8000)
const api = axios.create({
  baseURL: "/", // ← ganti jadi "/"
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response Interceptor: Otomatis menendang jika session habis (error 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user_info");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
