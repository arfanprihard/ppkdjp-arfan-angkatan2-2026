import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { X, AlertCircle, RefreshCw } from "lucide-react";
import { formatRupiah } from "./helpers";

const CheckOutModal = ({ reservation, onClose, onSaved }) => {
  const [folio, setFolio] = useState(null);
  const [loadingFolio, setLoadingFolio] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const checkInId = reservation.check_in?.id || reservation.checkIn?.id;

  const fetchFolio = useCallback(async () => {
    if (!checkInId) {
      setError("Data Check-In tidak ditemukan.");
      setLoadingFolio(false);
      return;
    }
    setLoadingFolio(true);
    try {
      const res = await api.get(`/api/folios/${checkInId}`);
      if (res.data.success) {
        setFolio(res.data.data);
      } else {
        setError("Gagal memuat billing folio.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil tagihan folio.");
    } finally {
      setLoadingFolio(false);
    }
  }, [checkInId]);

  useEffect(() => {
    fetchFolio();
  }, [fetchFolio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkInId) return;

    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/checkouts", {
        check_in_id: checkInId,
        payment_method: paymentMethod,
        feedback_rating: Number(feedbackRating),
        feedback_notes: feedbackNotes || null,
      });

      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message ?? "Gagal memproses checkout.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat checkout.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-base font-bold text-white">Proses Check-Out & Settlement</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer border-0 bg-transparent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loadingFolio ? (
            <div className="space-y-3 py-6 animate-pulse">
              <div className="h-5 bg-zinc-800 rounded-lg w-1/3" />
              <div className="h-24 bg-zinc-800 rounded-lg" />
            </div>
          ) : (
            folio && (
              <>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider">No. Folio: {folio.folio_number}</span>
                    <span className="text-zinc-400">Tamu: <strong className="text-white">{folio.guest?.name}</strong></span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/30 max-h-40 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse text-zinc-300">
                      <thead className="bg-zinc-950 text-[9px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 sticky top-0">
                        <tr>
                          <th className="p-2.5">Deskripsi Transaksi</th>
                          <th className="p-2.5 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {folio.charges?.map((c) => (
                          <tr key={c.id}>
                            <td className="p-2.5 font-medium">{c.description}</td>
                            <td className="p-2.5 text-right text-zinc-200">{formatRupiah(c.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 space-y-2 text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Total Biaya (Charges)</span>
                      <span className="font-semibold text-zinc-200">{formatRupiah(folio.total_charges)}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span>Total Pembayaran</span>
                      <span className="font-semibold text-emerald-400">{formatRupiah(folio.total_payments)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider">Sisa Tagihan (Balance)</span>
                      <span className={`text-sm font-extrabold ${folio.balance > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {formatRupiah(folio.balance)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Metode Pelunasan *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
                    >
                      <option value="cash">Cash / Tunai</option>
                      <option value="credit_card">Kartu Kredit</option>
                      <option value="debit">Debit</option>
                      <option value="transfer">Transfer Bank</option>
                      <option value="city_ledger">City Ledger (Perusahaan)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Rating Feedback (1-5)</label>
                    <select
                      value={feedbackRating}
                      onChange={(e) => setFeedbackRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (Sangat Puas)</option>
                      <option value={4}>⭐⭐⭐⭐ (Puas)</option>
                      <option value={3}>⭐⭐⭐ (Cukup)</option>
                      <option value={2}>⭐⭐ (Kurang)</option>
                      <option value={1}>⭐ (Sangat Kurang)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Komentar / Feedback Tamu</label>
                  <textarea
                    rows={2}
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Feedback tamu..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500/40 resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-800 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 cursor-pointer bg-transparent"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Memproses Check-Out...
                      </>
                    ) : (
                      "Settle & Check-Out"
                    )}
                  </button>
                </div>
              </>
            )
          )}
        </form>
      </div>
    </div>
  );
};

export default CheckOutModal;
