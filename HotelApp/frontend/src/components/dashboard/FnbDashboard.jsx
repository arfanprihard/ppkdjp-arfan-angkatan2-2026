import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import DailyReportSection from "./DailyReportSection";
import { ShoppingBag, TrendingUp, PlusCircle, RefreshCw } from "lucide-react";

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const FnbDashboard = ({ data, loading, refreshTrigger }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Pesanan Baru",
      icon: PlusCircle,
      path: "/fnb",
      color: "hover:border-blue-300 hover:text-blue-600",
    },
    {
      label: "Update Status Pesanan",
      icon: RefreshCw,
      path: "/fnb",
      color: "hover:border-emerald-300 hover:text-emerald-600",
    },
  ];

  // Active orders badge
  const hasActiveOrders = (data?.active_orders ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-blue-600" />
        <div>
          <h2 className="text-base font-bold text-zinc-800">Food & Beverage Overview</h2>
          <p className="text-[11px] text-zinc-500">Antrian pesanan & pendapatan F&B hari ini</p>
        </div>
      </div>

      {/* Active orders highlight card */}
      <div
        className={`relative bg-white border rounded-2xl p-6 overflow-hidden transition-all duration-300 shadow-sm ${
          hasActiveOrders
            ? "border-blue-200 hover:border-blue-300"
            : "border-zinc-200 hover:border-blue-200"
        }`}
      >
        <div className="flex items-center gap-5">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
              hasActiveOrders
                ? "bg-blue-600 shadow-lg shadow-blue-500/10"
                : "bg-slate-100"
            }`}
          >
            <ShoppingBag
              className={`h-7 w-7 ${hasActiveOrders ? "text-white" : "text-zinc-400"}`}
            />
          </div>
          <div>
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 w-16 bg-slate-100 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            ) : (
              <>
                <p className="text-4xl font-extrabold text-zinc-800 leading-none">
                  {data?.active_orders ?? 0}
                </p>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mt-1.5">
                  Pesanan Aktif
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {hasActiveOrders
                    ? "Sedang dalam proses pembuatan / penyiapan"
                    : "Tidak ada pesanan aktif saat ini"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Revenue */}
      <StatCard
        icon={TrendingUp}
        label="Pendapatan F&B Hari Ini"
        value={loading ? null : formatRupiah(data?.fnb_revenue_today)}
        sub="Dari pesanan yang sudah selesai"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        loading={loading}
      />

      {/* Quick Actions */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
          Tindakan Cepat
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-medium transition-all duration-200 cursor-pointer ${action.color} hover:bg-slate-50 shadow-xs`}
              >
                <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Report Section */}
      <div className="pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
          Laporan Harian Divisi
        </p>
        <DailyReportSection endpoint="/api/reports/fnb" role="fnb" refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default FnbDashboard;
