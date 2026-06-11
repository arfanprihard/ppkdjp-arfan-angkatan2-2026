import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import { ClipboardList, Loader2, Layers, WashingMachine, CheckSquare } from "lucide-react";

// Room status definition
const ROOM_STATUSES = [
  { key: "vc", label: "VC", desc: "Vacant Clean", color: "bg-emerald-400", textColor: "text-emerald-400", dot: "bg-emerald-400" },
  { key: "vd", label: "VD", desc: "Vacant Dirty", color: "bg-amber-400", textColor: "text-amber-400", dot: "bg-amber-400" },
  { key: "oc", label: "OC", desc: "Occupied Clean", color: "bg-sky-400", textColor: "text-sky-400", dot: "bg-sky-400" },
  { key: "od", label: "OD", desc: "Occupied Dirty", color: "bg-orange-500", textColor: "text-orange-400", dot: "bg-orange-500" },
  { key: "ooo", label: "OOO", desc: "Out of Order", color: "bg-zinc-600", textColor: "text-zinc-400", dot: "bg-zinc-600" },
];

// Stacked bar for room status
const RoomStatusBar = ({ data }) => {
  const total =
    (data?.vc_rooms ?? 0) +
    (data?.vd_rooms ?? 0) +
    (data?.oc_rooms ?? 0) +
    (data?.od_rooms ?? 0) +
    (data?.ooo_rooms ?? 0);

  const values = {
    vc: data?.vc_rooms ?? 0,
    vd: data?.vd_rooms ?? 0,
    oc: data?.oc_rooms ?? 0,
    od: data?.od_rooms ?? 0,
    ooo: data?.ooo_rooms ?? 0,
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/60 transition-all duration-300">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
        Distribusi Status Kamar
      </p>

      {/* Stacked bar */}
      <div className="flex h-4 rounded-full overflow-hidden gap-px mb-5 bg-zinc-800">
        {ROOM_STATUSES.map((s) => {
          const pct = total > 0 ? (values[s.key] / total) * 100 : 0;
          return pct > 0 ? (
            <div
              key={s.key}
              className={`${s.color} h-full transition-all duration-700`}
              style={{ width: `${pct}%` }}
              title={`${s.desc}: ${values[s.key]} kamar`}
            />
          ) : null;
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ROOM_STATUSES.map((s) => (
          <div key={s.key} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${s.dot} shrink-0`} />
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                {s.label}
              </span>
            </div>
            <p className={`text-xl font-extrabold ${s.textColor} leading-none`}>
              {values[s.key]}
            </p>
            <p className="text-[10px] text-zinc-600 leading-tight">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HousekeepingDashboard = ({ data, loading }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Board Kamar",
      icon: Layers,
      path: "/rooms",
      color: "hover:border-sky-500/40 hover:text-sky-400",
    },
    {
      label: "Daftar Tugas",
      icon: CheckSquare,
      path: "/housekeeping",
      color: "hover:border-emerald-500/40 hover:text-emerald-400",
    },
    {
      label: "Daftar Laundry",
      icon: WashingMachine,
      path: "/housekeeping",
      color: "hover:border-violet-500/40 hover:text-violet-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
        <div>
          <h2 className="text-base font-bold text-white">Housekeeping Overview</h2>
          <p className="text-[11px] text-zinc-500">Status kamar & antrian tugas hari ini</p>
        </div>
      </div>

      {/* Room status bar */}
      {loading ? (
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 animate-pulse">
          <div className="h-4 w-32 bg-zinc-800 rounded mb-4" />
          <div className="h-4 bg-zinc-800 rounded-full mb-5" />
          <div className="grid grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-8 bg-zinc-800 rounded" />
                <div className="h-6 w-10 bg-zinc-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <RoomStatusBar data={data} />
      )}

      {/* Task stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={ClipboardList}
          label="Tugas Menunggu"
          value={loading ? null : data?.pending_tasks ?? 0}
          sub="Belum ada petugas yang menangani"
          iconBg="from-amber-400 to-orange-500"
          loading={loading}
        />
        <StatCard
          icon={Loader2}
          label="Tugas Saya"
          value={loading ? null : data?.my_active_tasks ?? 0}
          sub="Sedang saya kerjakan"
          iconBg="from-emerald-400 to-teal-500"
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

export default HousekeepingDashboard;
