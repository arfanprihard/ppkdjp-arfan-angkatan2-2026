import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import { ShoppingBag, TrendingUp, PlusCircle, RefreshCw } from "lucide-react";

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const FnbDashboard = ({ data, loading }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Pesanan Baru",
      icon: PlusCircle,
      path: "/fnb",
      color: "hover:border-amber-500/40 hover:text-amber-400",
    },
    {
      label: "Update Status Pesanan",
      icon: RefreshCw,
      path: "/fnb",
      color: "hover:border-emerald-500/40 hover:text-emerald-400",
    },
  ];

  // Active orders badge
  const hasActiveOrders = (data?.active_orders ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
        <div>
          <h2 className="text-base font-bold text-white">Food & Beverage Overview</h2>
          <p className="text-[11px] text-zinc-500">Antrian pesanan & pendapatan F&B hari ini</p>
        </div>
      </div>

      {/* Active orders highlight card */}
      <div
        className={`relative bg-zinc-900/60 border rounded-2xl p-6 overflow-hidden transition-all duration-300 ${
          hasActiveOrders
            ? "border-amber-500/30 hover:border-amber-500/50"
            : "border-zinc-800/50 hover:border-zinc-700/60"
        }`}
      >
        {/* Glow blob */}
        {hasActiveOrders && (
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        )}
        <div className="flex items-center gap-5">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              hasActiveOrders
                ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/25"
                : "bg-zinc-800"
            }`}
          >
            <ShoppingBag
              className={`h-7 w-7 ${hasActiveOrders ? "text-white" : "text-zinc-500"}`}
            />
          </div>
          <div>
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 w-16 bg-zinc-800 rounded" />
                <div className="h-3 w-32 bg-zinc-700 rounded" />
              </div>
            ) : (
              <>
                <p className="text-4xl font-extrabold text-white leading-none">
                  {data?.active_orders ?? 0}
                </p>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mt-1.5">
                  Pesanan Aktif
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {hasActiveOrders
                    ? "Sedang dalam antrian / disiapkan / disajikan"
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
        sub="Dari pesanan yang sudah closed"
        iconBg="from-emerald-400 to-teal-500"
        loading={loading}
      />

      {/* Quick Actions */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Tindakan Cepat
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
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

export default FnbDashboard;
