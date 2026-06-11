import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading awal saat cek sesi

  // Cek sesi yang masih aktif saat pertama kali aplikasi dibuka
  useEffect(() => {
    const checkSession = async () => {
      const storedUser = localStorage.getItem("user_info");
      if (storedUser) {
        try {
          // Validasi ke server apakah session cookie masih berlaku
          const res = await api.get("/api/me");
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem("user_info", JSON.stringify(res.data.data));
          } else {
            // Session expired di server
            localStorage.removeItem("user_info");
            setUser(null);
          }
        } catch {
          // 401 atau error lain → session tidak valid
          localStorage.removeItem("user_info");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // Fungsi login — dipanggil dari LoginPage
  const login = async (email, password) => {
    // 1. Ambil CSRF cookie
    await api.get("/sanctum/csrf-cookie");

    // 2. Kirim kredensial
    const res = await api.post("/api/login", { email, password });

    if (res.data.success) {
      setUser(res.data.data);
      localStorage.setItem("user_info", JSON.stringify(res.data.data));
    }

    return res.data;
  };

  // Fungsi logout — panggil API lalu bersihkan state
  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch {
      // Tetap lanjut logout di client meskipun API gagal
    }
    setUser(null);
    localStorage.removeItem("user_info");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
