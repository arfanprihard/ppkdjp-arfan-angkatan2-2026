import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import {
  RefreshCw,
  AlertTriangle,
  ClipboardList,
  Plus,
  Play,
  Check,
  User,
  Clock,
  LayoutGrid,
  CheckCircle,
} from "lucide-react";

import { TASK_TYPES, PRIORITIES, STATUS_MAP, ROOM_STATUSES, formatTime } from "../components/housekeeping/helpers";
import CreateTaskModal from "../components/housekeeping/CreateTaskModal";
import TaskTableSkeleton from "../components/housekeeping/TaskTableSkeleton";
import TaskDetailModal from "../components/housekeeping/TaskDetailModal";

// ─── HALAMAN UTAMA HOUSEKEEPING ──────────────────────────────────────────────
const HousekeepingPage = () => {
  const [activeTab, setActiveTab] = useState("tasks"); // 'tasks' | 'board'
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [groupedRooms, setGroupedRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Default values for CreateTaskModal
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // Load HK Tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/housekeeping/tasks";
      if (filterStatus !== "all") {
        url += `?status=${filterStatus}`;
      }
      const res = await api.get(url);
      if (res.data.success) {
        setTasks(res.data.data || []);
      } else {
        setError("Gagal memuat tugas Housekeeping.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  // Load Rooms for Selection / Room Board
  const fetchRoomsAndBoard = useCallback(async () => {
    try {
      const resRooms = await api.get("/api/rooms");
      if (resRooms.data.success) {
        setRooms(resRooms.data.data || []);
      }

      const resBoard = await api.get("/api/housekeeping/room-board");
      if (resBoard.data.success) {
        setGroupedRooms(resBoard.data.data || {});
      }
    } catch (err) {
      console.error("Gagal memuat peta kamar", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchRoomsAndBoard();
  }, [fetchRoomsAndBoard]);

  // Update Task Status
  const handleUpdateStatus = async (taskId, payload) => {
    try {
      const res = await api.patch(`/api/housekeeping/tasks/${taskId}`, payload);
      if (res.data.success) {
        // Refresh all lists
        fetchTasks();
        fetchRoomsAndBoard();
      }
    } catch (err) {
      console.error("Gagal memperbarui status tugas", err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-blue-600" />
          <div>
            <h2 className="text-base font-bold text-zinc-900">Housekeeping & Kebersihan</h2>
            <p className="text-[11px] text-zinc-500">
              Kelola tugas kebersihan kamar, layanan turndown, dan peta status kamar hotel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex bg-slate-100 border border-zinc-200 p-0.5 rounded-xl mr-2">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-transparent ${
                activeTab === "tasks" ? "bg-white text-blue-600 shadow-xs border-zinc-200/50" : "text-zinc-550 hover:text-zinc-800"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5" />
                Daftar Tugas
              </span>
            </button>
            <button
              onClick={() => setActiveTab("board")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-transparent ${
                activeTab === "board" ? "bg-white text-blue-600 shadow-xs border-zinc-200/50" : "text-zinc-550 hover:text-zinc-800"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <LayoutGrid className="h-3.5 w-3.5" />
                Peta Kamar (Board)
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              fetchTasks();
              fetchRoomsAndBoard();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50 transition-all text-xs font-medium cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Segarkan
          </button>

          <button
            onClick={() => {
              setSelectedRoomId("");
              setShowCreate(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" /> Buat Tugas HK
          </button>
        </div>
      </div>

      {/* Main Tabs Content */}
      {activeTab === "tasks" ? (
        // --- TAB: TASKS LIST ---
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Status Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                filterStatus === "all"
                  ? "border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600/10"
                  : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              Semua Status
            </button>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  filterStatus === key
                    ? "border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600/10"
                    : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${val.dot}`} />
                {val.label}
              </button>
            ))}
          </div>

          {/* Table list */}
          {loading ? (
            <TaskTableSkeleton />
          ) : error ? (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-xs justify-center">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 border border-zinc-200 bg-white rounded-2xl shadow-sm">
              <ClipboardList className="h-10 w-10 mx-auto mb-3 text-zinc-400" />
              <p className="font-semibold text-zinc-800">Tidak ada tugas kebersihan saat ini</p>
              <p className="text-xs mt-1 text-zinc-500">Buat tugas baru atau ubah filter status di atas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-200 sticky top-0">
                  <tr>
                    <th className="p-4">Kamar</th>
                    <th className="p-4">Jenis Tugas</th>
                    <th className="p-4">Prioritas</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Assigned Staff</th>
                    <th className="p-4">Catatan / Keterangan</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-750">
                  {tasks.map((task) => {
                    const taskInfo = TASK_TYPES[task.task_type] || { label: task.task_type, color: "bg-zinc-100 text-zinc-600 border-zinc-200" };
                    const priorityInfo = PRIORITIES[task.priority] || { label: task.priority, color: "bg-zinc-100 text-zinc-600 border-zinc-200" };
                    const statusInfo = STATUS_MAP[task.status] || { label: task.status, color: "bg-zinc-100 text-zinc-600 border-zinc-200" };

                    return (
                      <tr
                        key={task.id}
                        onClick={(e) => {
                          if (!e.target.closest('button')) {
                            setSelectedTask(task);
                          }
                        }}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <div className="font-extrabold text-zinc-900 text-sm">Kamar {task.room?.room_number}</div>
                          <div className="text-[10px] text-zinc-450 mt-0.5">Lantai {task.room?.floor} · {task.room?.room_type?.name}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${taskInfo.color}`}>
                            {taskInfo.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${priorityInfo.color}`}>
                            {priorityInfo.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${statusInfo.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-zinc-700">
                            <User className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="font-medium">{task.assigned_staff?.name || "Unassigned"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="max-w-[200px] truncate text-zinc-600 italic" title={task.notes || ""}>
                            {task.notes || "Tidak ada catatan"}
                          </div>
                          {task.completed_at && (
                            <div className="text-[9px] text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Clock className="h-2.5 w-2.5" /> Selesai: {formatTime(task.completed_at)}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {task.status === "pending" && (
                              <button
                                onClick={() => handleUpdateStatus(task.id, { status: "in_progress" })}
                                className="px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer font-bold text-[10px] flex items-center gap-1 shadow-xs"
                                title="Mulai Kerjakan Tugas"
                              >
                                <Play className="h-3 w-3 text-emerald-600 fill-emerald-600" />
                                Mulai
                              </button>
                            )}
                            {task.status === "in_progress" && (
                              <button
                                onClick={() => handleUpdateStatus(task.id, { status: "completed" })}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer font-bold text-[10px] flex items-center gap-1 shadow-sm"
                                title="Selesaikan Tugas Kebersihan"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Selesai
                              </button>
                            )}
                            {task.status === "completed" && (
                              <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                                Tersinkron (VC)
                              </span>
                            )}
                            {task.status === "cancelled" && (
                              <span className="text-[10px] text-zinc-450 font-bold">Dibatalkan</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // --- TAB: ROOM BOARD ---
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-650" />
              Peta Distribusi Status Kamar Hotel
            </h3>
            
            <div className="space-y-6">
              {Object.keys(groupedRooms).length === 0 ? (
                <div className="text-center py-10 text-zinc-500">Memuat peta kamar...</div>
              ) : (
                Object.keys(groupedRooms)
                  .sort((a, b) => b - a) // Show highest floor first
                  .map((floor) => (
                    <div key={floor} className="space-y-2 border-b border-zinc-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">
                        Lantai {floor}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {groupedRooms[floor].map((room) => {
                          const rStatus = ROOM_STATUSES[room.status] || { label: room.status.toUpperCase(), color: "bg-zinc-100 text-zinc-700 border-zinc-250", dot: "bg-zinc-500" };
                          const isDirty = room.status === "vd" || room.status === "od";

                          return (
                            <div
                              key={room.id}
                              className={`rounded-xl border p-3 flex flex-col justify-between space-y-2 relative transition-all ${rStatus.color}`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-base font-extrabold text-zinc-800 leading-none">
                                  {room.room_number}
                                </span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border leading-none bg-white/80 border-zinc-200/40 text-zinc-700`}>
                                  {rStatus.label}
                                </span>
                              </div>
                              
                              <div className="text-[9px] truncate opacity-85 font-medium leading-none text-zinc-600">
                                {room.room_type?.name}
                              </div>

                              {isDirty && (
                                <button
                                  onClick={() => {
                                    setSelectedRoomId(room.id);
                                    setShowCreate(true);
                                  }}
                                  className="w-full mt-1.5 py-1 text-[8px] font-extrabold uppercase bg-blue-600 hover:bg-blue-750 text-white rounded transition-all cursor-pointer text-center shadow-xs"
                                  title="Buat Tugas Pembersihan Kamar Kotor"
                                >
                                  Bersihkan
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreate && (
        <CreateTaskModal
          rooms={rooms}
          initialRoomId={selectedRoomId}
          onClose={() => {
            setSelectedRoomId("");
            setShowCreate(false);
          }}
          onSaved={() => {
            setSelectedRoomId("");
            setShowCreate(false);
            fetchTasks();
            fetchRoomsAndBoard();
          }}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default HousekeepingPage;
