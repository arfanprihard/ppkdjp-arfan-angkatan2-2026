import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import {
  BedDouble,
  TrendingUp,
  CalendarPlus,
  BarChart2,
  ShieldAlert,
  Layers,
} from "lucide-react";

// Format ke Rupiah
const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

// Circular Progress Ring SVG
const OccupancyRing = ({ rate = 0 }) => {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (rate / 100) * circumference;

  const color =
    rate >= 80
      ? "#f59e0b" // amber-400
      : rate >= 50
      ? "#f97316" // orange-500
      : "#6b7280"; // zinc-500

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative flex items-center justify-center">
        <svg width="128" height="128" className="-rotate-90">
          {/* Track */}
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="#27272a"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-extrabold text-white leading-none">
            {rate}%
          </span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
            Hunian
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ data, loading }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Laporan Keuangan",
      icon: BarChart2,
      path: "/reports",
      color: "hover:border-amber-500/40 hover:text-amber-400",
    },
    {
      label: "Kelola Staf",
      icon: ShieldAlert,
      path: "/users",
      color: "hover:border-rose-500/40 hover:text-rose-400",
    },
    {
      label: "Status Kamar",
      icon: Layers,
      path: "/rooms",
      color: "hover:border-sky-500/40 hover:text-sky-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
        <div>
          <h2 className="text-base font-bold text-white">Overview Admin</h2>
          <p className="text-[11px] text-zinc-500">Ringkasan operasional hotel hari ini</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Occupancy Ring — spans 1 col */}
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-zinc-700/60 transition-all duration-300">
          {loading ? (
            <div className="h-32 w-32 rounded-full bg-zinc-800 animate-pulse" />
          ) : (
            <>
              <OccupancyRing rate={data?.occupancy_rate ?? 0} />
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mt-2">
                Tingkat Hunian
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                {data?.occupied_rooms ?? 0} / {data?.total_rooms ?? 0} kamar ditempati
              </p>
            </>
          )}
        </div>

        {/* Stats — spans 2 cols */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Pendapatan Hari Ini"
            value={loading ? null : formatRupiah(data?.revenue_today)}
            sub="Dari seluruh folio tamu"
            iconBg="from-emerald-400 to-teal-500"
            loading={loading}
          />
          <StatCard
            icon={CalendarPlus}
            label="Reservasi Baru"
            value={loading ? null : data?.new_reservations_today ?? 0}
            sub="Dibuat hari ini"
            iconBg="from-sky-400 to-blue-500"
            loading={loading}
          />
          <StatCard
            icon={BedDouble}
            label="Total Kamar"
            value={loading ? null : data?.total_rooms ?? 0}
            sub={`${data?.occupied_rooms ?? 0} sedang dihuni`}
            iconBg="from-violet-400 to-purple-500"
            loading={loading}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Tindakan Cepat
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 text-sm font-medium transition-all duration-200 cursor-pointer ${action.color} hover:bg-zinc-800/40`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
