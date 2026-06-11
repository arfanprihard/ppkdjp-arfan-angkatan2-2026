import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import ReceptionistDashboard from "../components/dashboard/ReceptionistDashboard";
import HousekeepingDashboard from "../components/dashboard/HousekeepingDashboard";
import FnbDashboard from "../components/dashboard/FnbDashboard";
import { RefreshCw, AlertTriangle } from "lucide-react";

// Greeting berdasarkan jam
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

// Format tanggal Indonesia
const formatDate = () =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

// Role badge colors
const ROLE_BADGE = {
  admin: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  receptionist: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  housekeeping: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  fnb: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

// Role display name
const ROLE_LABEL = {
  admin: "Administrator",
  receptionist: "Resepsionis",
  housekeeping: "Housekeeping",
  fnb: "F&B Service",
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/dashboard/stats");
      if (res.data.success) {
        setData(res.data.data);
        setLastUpdated(new Date());
      } else {
        setError("Gagal mengambil data dashboard.");
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const role = user?.role;
  const badgeClass = ROLE_BADGE[role] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  const roleLabel = ROLE_LABEL[role] || role;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-6 overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute -top-10 -right-10 h-40 w-40 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 h-20 w-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-start justify-between flex-wrap gap-4">
          {/* Left — greeting */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded border tracking-widest ${badgeClass}`}
              >
                {roleLabel}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {getGreeting()},{" "}
              <span className="text-amber-400">{user?.name?.split(" ")[0] ?? "Staf"}!</span> 👋
            </h1>
            <p className="text-sm text-zinc-500 mt-1">{formatDate()}</p>
          </div>

          {/* Right — refresh */}
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Perbarui Data
            </button>
            {lastUpdated && (
              <p className="text-[10px] text-zinc-600">
                Diperbarui:{" "}
                {lastUpdated.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-4 text-sm text-rose-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Terjadi Kesalahan</p>
            <p className="text-xs text-rose-400/70 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Role-based Dashboard */}
      {role === "admin" && (
        <AdminDashboard data={data} loading={loading} />
      )}
      {role === "receptionist" && (
        <ReceptionistDashboard data={data} loading={loading} />
      )}
      {role === "housekeeping" && (
        <HousekeepingDashboard data={data} loading={loading} />
      )}
      {role === "fnb" && (
        <FnbDashboard data={data} loading={loading} />
      )}

      {/* Fallback jika role tidak dikenal */}
      {!["admin", "receptionist", "housekeeping", "fnb"].includes(role) && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
          <AlertTriangle className="h-10 w-10 mb-3 text-zinc-700" />
          <p className="font-semibold text-zinc-400">Role tidak dikenali</p>
          <p className="text-sm mt-1">Dashboard tidak tersedia untuk role &quot;{role}&quot;.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
