import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Hotel, Eye, EyeOff } from "lucide-react";
import ppkdLogo from "../assets/ppkd_logo.png";


const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-redirect jika sudah login
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Login gagal.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Koneksi ke server gagal. Pastikan Backend berjalan di port 8000.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-zinc-800 p-6">
      {/* Background */}
      <div className="fixed inset-0 bg-slate-50" />

      <div className="relative w-full max-w-[400px]">
        {/* Card */}
        <div className="relative bg-white border border-zinc-200 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-zinc-200 p-2 shadow-sm mb-4">
              <img src={ppkdLogo} alt="Logo" className="h-10 w-10 object-contain" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Login Staff Hotel Syariah
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1.5 uppercase tracking-widest font-semibold">
              Sistem Manajemen Hotel
            </p>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-600 flex items-center gap-2.5">
              <span className="text-base">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email-input" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Email Staf
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 transition-all duration-200"
                placeholder="nama@hotelsyariah.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password-input" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 pr-11 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 transition-all duration-200"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              id="login-button"
              type="submit"
              disabled={loading}
              className="w-full mt-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm font-bold transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menghubungkan...
                </>
              ) : (
                "Masuk Dashboard"
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-zinc-400 mt-6">
            © 2026 Hotel Syariah • Internal Staff Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
