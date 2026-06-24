import { useState } from "react";
import { X, AlertCircle, Plus, Trash2, CheckCircle, PlayCircle, ClipboardList, MapPin, User, Calendar, FileText } from "lucide-react";
import { TASK_TYPES, PRIORITIES, STATUS_MAP } from "./helpers";

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const TaskDetailModal = ({ task, onClose, onStatusUpdate }) => {
  const [damageCharges, setDamageCharges] = useState([]);
  const [saving, setSaving] = useState(false);

  if (!task) return null;

  const taskType = TASK_TYPES[task.task_type] || { label: task.task_type };
  const priority = PRIORITIES[task.priority] || { label: task.priority };
  const status = STATUS_MAP[task.status] || { label: task.status };

  const addDamageRow = () => {
    setDamageCharges(prev => [...prev, { item_name: "", amount: "" }]);
  };

  const updateDamageRow = (index, field, value) => {
    setDamageCharges(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const removeDamageRow = (index) => {
    setDamageCharges(prev => prev.filter((_, i) => i !== index));
  };

  const handleStatusChange = async (newStatus) => {
    const statusLabels = { in_progress: "Mulai Mengerjakan", completed: "Selesaikan" };
    if (!window.confirm(`Konfirmasi: ${statusLabels[newStatus] || newStatus} tugas ini?`)) return;

    setSaving(true);
    try {
      const payload = { status: newStatus };
      if (newStatus === "completed" && damageCharges.length > 0) {
        const validCharges = damageCharges.filter(d => d.item_name && parseFloat(d.amount) > 0);
        if (validCharges.length > 0) {
          payload.damage_charges = validCharges.map(d => ({ item_name: d.item_name, amount: parseFloat(d.amount) }));
        }
      }
      await onStatusUpdate(task.id, payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-zinc-900">Detail Tugas Housekeeping</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-605 rounded-lg hover:bg-zinc-100 cursor-pointer border-0 bg-transparent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Task Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-zinc-200 rounded-xl p-3 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1"><MapPin className="h-3 w-3" />Kamar</span>
              <p className="text-sm font-bold text-zinc-800">{task.room?.room_number || "—"}</p>
              <p className="text-[10px] text-zinc-500">{task.room?.room_type?.name || ""}</p>
            </div>
            <div className="bg-slate-50 border border-zinc-200 rounded-xl p-3 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1"><User className="h-3 w-3" />Petugas</span>
              <p className="text-sm font-bold text-zinc-800">{task.assigned_staff?.name || "Belum ditugaskan"}</p>
            </div>
            <div className="bg-slate-50 border border-zinc-200 rounded-xl p-3 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Jenis Tugas</span>
              <p className="text-sm font-bold text-zinc-800">{taskType.label}</p>
            </div>
            <div className="bg-slate-50 border border-zinc-200 rounded-xl p-3 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Prioritas</span>
              <span className={`inline-flex px-2 py-0.5 rounded-lg border text-[10px] font-bold ${priority.color || 'bg-zinc-100 text-zinc-650 border-zinc-200'}`}>{priority.label}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between bg-slate-50 border border-zinc-200 rounded-xl p-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Status Saat Ini</span>
            <span className={`inline-flex px-2.5 py-1 rounded-lg border text-[10px] font-bold ${status.color || 'bg-zinc-100 text-zinc-650 border-zinc-200'}`}>{status.label}</span>
          </div>

          {/* Notes */}
          {task.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1 mb-1"><FileText className="h-3 w-3" />Catatan</span>
              <p className="text-xs text-zinc-750">{task.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Dibuat: {task.created_at ? new Date(task.created_at).toLocaleString("id-ID") : "—"}</span>
            {task.completed_at && <span>Selesai: {new Date(task.completed_at).toLocaleString("id-ID")}</span>}
          </div>

          {/* Damage Charges Section (only for in_progress tasks) */}
          {task.status === "in_progress" && (
            <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-805 text-amber-800">Denda Kerusakan / Kehilangan Barang</h4>
                {["oc", "od"].includes(task.room?.status) ? (
                  <button type="button" onClick={addDamageRow} className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer bg-transparent border-0">
                    <Plus className="h-3.5 w-3.5" /> Tambah Item
                  </button>
                ) : (
                  <span className="text-[10px] text-zinc-450 italic font-medium">Kamar kosong (sudah checkout)</span>
                )}
              </div>
              {!["oc", "od"].includes(task.room?.status) ? (
                <p className="text-[11px] text-zinc-450 italic bg-zinc-50 border border-zinc-200/60 p-2.5 rounded-xl">
                  ⚠️ Denda tidak dapat ditambahkan karena kamar ini tidak memiliki tamu aktif (sudah checkout).
                </p>
              ) : damageCharges.length === 0 ? (
                <p className="text-[11px] text-zinc-400 italic">Tidak ada denda kerusakan. Klik "Tambah Item" jika ada barang rusak/hilang.</p>
              ) : (
                <div className="space-y-2">
                  {damageCharges.map((dc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nama barang..."
                        value={dc.item_name}
                        onChange={(e) => updateDamageRow(idx, "item_name", e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600"
                      />
                      <input
                        type="number"
                        placeholder="Nominal (Rp)"
                        value={dc.amount}
                        onChange={(e) => updateDamageRow(idx, "amount", e.target.value)}
                        className="w-36 px-3 py-2 text-xs rounded-lg border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600"
                      />
                      <button type="button" onClick={() => removeDamageRow(idx)} className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer bg-transparent border-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {damageCharges.some(d => parseFloat(d.amount) > 0) && (
                    <div className="text-right text-xs font-bold text-zinc-700 pt-1 border-t border-zinc-200">
                      Total Denda: {formatRupiah(damageCharges.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-650 text-sm font-medium hover:bg-zinc-50 cursor-pointer bg-transparent">
              Tutup
            </button>
            {task.status === "pending" && (
              <button
                type="button"
                onClick={() => handleStatusChange("in_progress")}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 border-0"
              >
                <PlayCircle className="h-4 w-4" /> Mulai Tugas
              </button>
            )}
            {task.status === "in_progress" && (
              <button
                type="button"
                onClick={() => handleStatusChange("completed")}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 border-0"
              >
                <CheckCircle className="h-4 w-4" /> Selesaikan Tugas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
