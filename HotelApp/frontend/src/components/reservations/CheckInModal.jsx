import { useState } from "react";
import api from "../../api/axios";
import { X, AlertCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { formatRupiah, getNights } from "./helpers";

const CheckInModal = ({ reservation, rooms, onClose, onSaved }) => {
  const [roomId, setRoomId] = useState("");
  const depositAmount = reservation.total_amount || 0;
  const [securityDeposit, setSecurityDeposit] = useState(300000);
  const [depositMethod, setDepositMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const availableRooms = rooms.filter(
    (r) =>
      String(r.room_type?.id || r.roomType?.id) === String(reservation.room_type_id) &&
      r.status === "vc"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId) {
      setError("Silakan pilih kamar ketersediaan yang bersih (VC).");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/checkins", {
        reservation_id: reservation.id,
        room_id: Number(roomId),
        deposit_amount: Number(depositAmount),
        security_deposit: Number(securityDeposit),
        deposit_method: depositMethod,
        notes: notes || null,
      });

      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message ?? "Gagal memproses check-in.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat check-in.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-bold text-zinc-900">Proses Check-In Tamu</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer border-0 bg-transparent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="bg-slate-50 border border-zinc-200 p-3 rounded-xl text-xs space-y-1.5 text-zinc-600">
            <p><strong className="text-zinc-800">Kode Booking:</strong> {reservation.reservation_code}</p>
            <p><strong className="text-zinc-800">Nama Tamu:</strong> {reservation.guest?.name}</p>
            <p><strong className="text-zinc-800">Tipe Kamar:</strong> {reservation.room_type?.name || reservation.roomType?.name}</p>
            <p><strong className="text-zinc-800">Masa Stay:</strong> {reservation.check_in_date} s/d {reservation.check_out_date} ({getNights(reservation.check_in_date, reservation.check_out_date)} malam)</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Pilih Kamar Fisik (Harus Bersih - VC) *</label>
            <select
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-850 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
            >
              <option value="">-- Pilih Kamar Bersih (VC) --</option>
              {availableRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Kamar {r.room_number} (Lantai {r.floor} · VC)
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-xl mt-1 flex items-start gap-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                Peringatan: Tidak ada kamar bersih (VC) bertipe ini yang tersedia. Silakan bersihkan kamar terlebih dahulu.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Total Pembayaran (Lunas) *</label>
              <input
                type="text"
                disabled
                value={formatRupiah(depositAmount)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-zinc-100 text-zinc-500 cursor-not-allowed outline-none font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Metode Pembayaran *</label>
              <select
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
              >
                <option value="cash">Cash / Tunai</option>
                <option value="credit_card">Kartu Kredit</option>
                <option value="debit">Debit</option>
                <option value="transfer">Transfer Bank</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Deposit Jaminan Kerusakan *</label>
              <input
                type="number"
                min="0"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 font-semibold"
              />
            </div>
            <div className="space-y-1 flex flex-col justify-end text-[11px] text-zinc-500 pb-1.5">
              <span>* Dikembalikan saat checkout jika tidak ada kerusakan kamar.</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan penyerahan kunci, request extra..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-600 text-sm font-medium hover:bg-zinc-50 cursor-pointer bg-transparent"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || !roomId}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Memproses Check-In...
                </>
              ) : (
                "Konfirmasi Check-In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;
