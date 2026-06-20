import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import DailyReportSection from "./DailyReportSection";
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
      color: "hover:border-emerald-300 hover:text-emerald-600",
    },
    {
      label: "Reservasi Baru",
      icon: CalendarPlus,
      path: "/reservations",
      color: "hover:border-blue-300 hover:text-blue-600",
    },
    {
      label: "Daftar Tamu",
      icon: ListOrdered,
      path: "/guests",
      color: "hover:border-blue-300 hover:text-blue-600",
    },
  ];

  // split card — arrivals & departures
  const SplitCard = () => (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-all duration-300 shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-zinc-200">
        {/* Arrivals */}
        <div className="p-5 flex flex-col gap-2">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 w-8 rounded-xl bg-slate-100" />
              <div className="h-7 w-12 bg-slate-100 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          ) : (
            <>
              <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <PlaneLanding className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-zinc-800 leading-none">
                {data?.arrivals_today ?? 0}
              </p>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                Kedatangan
              </p>
              <p className="text-[11px] text-zinc-400">Tamu check-in hari ini</p>
            </>
          )}
        </div>

        {/* Departures */}
        <div className="p-5 flex flex-col gap-2">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 w-8 rounded-xl bg-slate-100" />
              <div className="h-7 w-12 bg-slate-100 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          ) : (
            <>
              <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center">
                <PlaneTakeoff className="h-4 w-4 text-rose-600" />
              </div>
              <p className="text-3xl font-extrabold text-zinc-800 leading-none">
                {data?.departures_today ?? 0}
              </p>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                Keberangkatan
              </p>
              <p className="text-[11px] text-zinc-400">Tamu check-out hari ini</p>
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
        <div className="h-8 w-1 rounded-full bg-blue-600" />
        <div>
          <h2 className="text-base font-bold text-zinc-800">Front Office Overview</h2>
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
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          loading={loading}
        />
        <StatCard
          icon={Users}
          label="Tamu Aktif"
          value={loading ? null : data?.active_guests_in_house ?? 0}
          sub="Saat ini sedang menginap"
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
          Tindakan Cepat
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        <DailyReportSection endpoint="/api/reports/receptionist" role="receptionist" />
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
