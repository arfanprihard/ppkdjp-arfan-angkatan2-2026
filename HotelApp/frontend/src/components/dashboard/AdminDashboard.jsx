import React from "react";
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

// Short Format for scale
const formatShortRupiah = (value) => {
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}jt`;
  if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}rb`;
  return `Rp ${value}`;
};

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
      : "#10b981"; // emerald-500

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
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black text-white leading-none">
            {rate}%
          </span>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
            Hunian
          </span>
        </div>
      </div>
    </div>
  );
};

// Custom interactive CSS-based Revenue Chart (supporting dynamic year selection and 12 months)
const RevenueChart = ({ data, availableYears = [], selectedYear, onYearChange }) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.total), 100000); // fallback

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 hover:border-zinc-700/60 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group">
      {/* Background glow decorator */}
      <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
            Statistik Finansial
          </p>
          <h3 className="text-base font-extrabold text-white mt-0.5">
            Pendapatan Bulanan
          </h3>
        </div>

        {/* Dropdown pemilih tahun */}
        <div className="flex items-center gap-2">
          {availableYears.length > 0 && (
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer focus:border-amber-500/40 font-semibold"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Tahun {yr}
                </option>
              ))}
            </select>
          )}
          <div className="flex items-center gap-1.5 bg-zinc-950/60 px-2.5 py-1.5 rounded-lg border border-zinc-800/80 text-[10px] font-bold text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            12 Bulan
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-60 flex items-end justify-between gap-3 pt-8 border-b border-zinc-800/60 pb-1">
        {/* Y-Axis Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-zinc-400 font-bold tracking-wider">
          <div className="border-t border-zinc-800/30 w-full pt-1 flex justify-between">
            <span>{formatShortRupiah(maxVal)}</span>
          </div>
          <div className="border-t border-zinc-800/30 w-full pt-1 flex justify-between">
            <span>{formatShortRupiah(maxVal * 0.67)}</span>
          </div>
          <div className="border-t border-zinc-800/30 w-full pt-1 flex justify-between">
            <span>{formatShortRupiah(maxVal * 0.33)}</span>
          </div>
          <div className="w-full flex justify-between pb-1">
            <span>Rp 0</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="relative z-10 w-full h-full flex items-end justify-around gap-2 px-1">
          {data.map((d, index) => {
            const pct = maxVal > 0 ? (d.total / maxVal) * 85 : 0; // max height is 85%
            return (
              <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group/bar relative">
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 opacity-0 scale-95 group-hover/bar:opacity-100 group-hover/bar:scale-100 transition-all duration-200 pointer-events-none z-30 bg-zinc-950/95 border border-zinc-800 px-3 py-1.5 rounded-xl text-center shadow-2xl shadow-black/85 min-w-[120px]">
                  <p className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider">{d.month}</p>
                  <p className="text-xs font-black text-amber-400 mt-1">{formatRupiah(d.total)}</p>
                </div>

                {/* Bar */}
                <div
                  style={{ height: `${Math.max(pct, 4)}%` }}
                  className="w-full max-w-[20px] sm:max-w-[28px] rounded-t-lg bg-gradient-to-t from-orange-600 via-amber-500 to-amber-400 group-hover/bar:from-orange-500 group-hover/bar:to-amber-300 transition-all duration-500 ease-out relative shadow-lg shadow-amber-500/10 cursor-pointer overflow-hidden"
                >
                  {/* Glass reflection strip */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10" />
                </div>

                {/* X-Axis Month label */}
                <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 mt-2.5 group-hover/bar:text-zinc-200 transition-colors whitespace-nowrap">
                  {d.month.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ data, loading, onYearChange }) => {
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

      {/* Main Grid: Occupancy Ring and Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Occupancy Ring */}
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-zinc-700/60 transition-all duration-300 relative overflow-hidden group">
          {/* Subtle decoration glow */}
          <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-amber-500/5 blur-xl group-hover:scale-110 transition-transform duration-500" />
          
          {loading ? (
            <div className="h-32 w-32 rounded-full bg-zinc-800/40 animate-pulse" />
          ) : (
            <>
              <OccupancyRing rate={data?.occupancy_rate ?? 0} />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-3">
                Tingkat Hunian
              </p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                <span className="text-white font-bold">{data?.occupied_rooms ?? 0}</span> dari <span className="text-zinc-300 font-bold">{data?.total_rooms ?? 0}</span> kamar terisi
              </p>
            </>
          )}
        </div>

        {/* Stat Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Pendapatan Hari Ini"
            value={loading ? null : formatRupiah(data?.revenue_today)}
            sub="Folio & tagihan hari ini"
            iconBg="from-emerald-400 to-teal-500"
            loading={loading}
          />
          <StatCard
            icon={CalendarPlus}
            label="Reservasi Baru"
            value={loading ? null : data?.new_reservations_today ?? 0}
            sub="Masuk hari ini"
            iconBg="from-sky-400 to-blue-500"
            loading={loading}
          />
          <StatCard
            icon={BedDouble}
            label="Total Kamar"
            value={loading ? null : data?.total_rooms ?? 0}
            sub={`${data?.occupied_rooms ?? 0} kamar sedang dihuni`}
            iconBg="from-violet-400 to-purple-500"
            loading={loading}
          />
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {!loading && data?.monthly_revenue && (
        <RevenueChart
          data={data.monthly_revenue}
          availableYears={data.available_years}
          selectedYear={data.selected_year}
          onYearChange={onYearChange}
        />
      )}

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
