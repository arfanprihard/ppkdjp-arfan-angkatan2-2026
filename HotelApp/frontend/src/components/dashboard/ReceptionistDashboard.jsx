import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import {
  PlaneLanding,
  PlaneTakeoff,
  BedDouble,
  Users,
  CalendarPlus,
  CheckSquare,
  ListOrdered,
} from "lucide-react";

const ReceptionistDashboard = ({ data, loading }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Check-In Tamu",
      icon: CheckSquare,
      path: "/reservations",
      color: "hover:border-emerald-500/40 hover:text-emerald-400",
    },
    {
      label: "Reservasi Baru",
      icon: CalendarPlus,
      path: "/reservations",
      color: "hover:border-amber-500/40 hover:text-amber-400",
    },
    {
      label: "Daftar Tamu",
      icon: ListOrdered,
      path: "/guests",
      color: "hover:border-sky-500/40 hover:text-sky-400",
    },
  ];

  // split card — arrivals & departures
  const SplitCard = () => (
    <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700/60 transition-all duration-300">
      <div className="grid grid-cols-2 divide-x divide-zinc-800/50">
        {/* Arrivals */}
        <div className="p-5 flex flex-col gap-2">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 w-8 rounded-xl bg-zinc-800" />
              <div className="h-7 w-12 bg-zinc-800 rounded" />
              <div className="h-3 w-20 bg-zinc-700 rounded" />
            </div>
          ) : (
            <>
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <PlaneLanding className="h-4 w-4 text-white" />
              </div>
              <p className="text-3xl font-extrabold text-white leading-none">
                {data?.arrivals_today ?? 0}
              </p>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                Kedatangan
              </p>
              <p className="text-[11px] text-zinc-600">Tamu check-in hari ini</p>
            </>
          )}
        </div>

        {/* Departures */}
        <div className="p-5 flex flex-col gap-2">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 w-8 rounded-xl bg-zinc-800" />
              <div className="h-7 w-12 bg-zinc-800 rounded" />
              <div className="h-3 w-20 bg-zinc-700 rounded" />
            </div>
          ) : (
            <>
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
                <PlaneTakeoff className="h-4 w-4 text-white" />
              </div>
              <p className="text-3xl font-extrabold text-white leading-none">
                {data?.departures_today ?? 0}
              </p>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                Keberangkatan
              </p>
              <p className="text-[11px] text-zinc-600">Tamu check-out hari ini</p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-sky-400 to-blue-500" />
        <div>
          <h2 className="text-base font-bold text-white">Front Office Overview</h2>
          <p className="text-[11px] text-zinc-500">Status kedatangan & keberangkatan hari ini</p>
        </div>
      </div>

      {/* Split arrivals/departures */}
      <SplitCard />

      {/* Bottom stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={BedDouble}
          label="Kamar Siap Huni"
          value={loading ? null : data?.vacant_clean_rooms ?? 0}
          sub="Vacant Clean (VC) — siap dijual"
          iconBg="from-amber-400 to-orange-500"
          loading={loading}
        />
        <StatCard
          icon={Users}
          label="Tamu Aktif"
          value={loading ? null : data?.active_guests_in_house ?? 0}
          sub="Saat ini sedang menginap"
          iconBg="from-violet-400 to-purple-500"
          loading={loading}
        />
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

export default ReceptionistDashboard;
