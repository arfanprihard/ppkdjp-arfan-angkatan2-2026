import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { X, AlertCircle, RefreshCw, Plus, Trash2, ChevronRight, ShieldAlert, CheckCircle } from "lucide-react";
import { formatRupiah } from "./helpers";
import { useToast } from "../../contexts/ToastContext";

const CheckOutModal = ({ reservation, onClose, onSaved }) => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [folio, setFolio] = useState(null);
  const [loadingFolio, setLoadingFolio] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [damageCharges, setDamageCharges] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const checkInId = reservation.check_in?.id || reservation.checkIn?.id;
  const checkIn = reservation.check_in || reservation.checkIn;
  const depositAmount = parseFloat(checkIn?.deposit_amount || 0);

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

  const [inspectionStatus, setInspectionStatus] = useState("none"); // none, pending, completed
  const [inspectionTask, setInspectionTask] = useState(null);
  const [checkingInspection, setCheckingInspection] = useState(false);

  const checkInspectionStatus = useCallback(async () => {
    if (!checkInId) return;
    setCheckingInspection(true);
    try {
      const res = await api.get(`/api/checkouts/${checkInId}/inspection-status`);
      if (res.data.success) {
        setInspectionStatus(res.data.status);
        setInspectionTask(res.data.task);
        if (res.data.status === "completed") {
          fetchFolio();
        }
      }
    } catch (err) {
      console.error("Gagal mengecek status inspeksi", err);
    } finally {
      setCheckingInspection(false);
    }
  }, [checkInId, fetchFolio]);

  useEffect(() => {
    checkInspectionStatus();
  }, [checkInspectionStatus]);

  const handleRequestInspection = async () => {
    if (!checkInId) return;
    setError(null);
    try {
      const res = await api.post(`/api/checkouts/${checkInId}/request-inspection`);
      if (res.data.success) {
        setInspectionStatus("pending");
        setInspectionTask(res.data.task);
        toast.info(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal meminta inspeksi kamar.");
    }
  };

  const securityDeposit = parseFloat(checkIn?.security_deposit || 300000);
  const remainingBalance = (folio?.total_charges || 0) - (folio?.total_payments || 0);
  
  const totalDamage = folio?.charges
    ? folio.charges
        .filter(c => c.description && c.description.toLowerCase().includes("denda"))
        .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)
    : 0;
  
  // Hitung deposit refund & sisa yang harus dibayar tamu
  // Jika tagihan > deposit, deposit habis (refund = 0), tamu bayar selisihnya
  // Jika tagihan <= deposit, tamu dapat kembalian deposit - tagihan
  const netDue = remainingBalance - securityDeposit;
  const depositRefund = netDue <= 0 ? Math.abs(netDue) : 0;
  const amountToPay = netDue > 0 ? netDue : 0;
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkInId) return;

    if (
      !window.confirm(
        "Konfirmasi: Proses checkout tamu ini? Pastikan semua data pembayaran sudah diselesaikan."
      )
    )
      return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        check_in_id: checkInId,
        payment_method: paymentMethod,
        feedback_notes: feedbackNotes || null,
        room_inspected: true,
      };

      const res = await api.post("/api/checkouts", payload);
      if (res.data.success) {
        toast.success("Checkout berhasil diselesaikan!");
        onSaved();
      } else {
        setError(res.data.message ?? "Gagal memproses checkout.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Terjadi kesalahan saat checkout."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-base font-bold text-zinc-900">
              {step === 1 ? "Step 1: Pengecekan Kamar" : "Step 2: Settlement & Refund Deposit"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
              <span className={`px-2 py-0.5 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>1</span>
              <ChevronRight className="h-3 w-3" />
              <span className={`px-2 py-0.5 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>2</span>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-650 rounded-lg hover:bg-zinc-100 cursor-pointer border-0 bg-transparent">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loadingFolio ? (
            <div className="space-y-3 py-6 animate-pulse">
              <div className="h-5 bg-zinc-100 rounded-lg w-1/3" />
              <div className="h-24 bg-zinc-100 rounded-lg" />
            </div>
          ) : folio && (
            <>
              {/* === STEP 1: Room Inspection === */}
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-xl border border-zinc-200">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Kamar</span>
                        <strong className="text-sm text-zinc-805">No. {reservation.room?.room_number || "—"}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Tamu</span>
                        <strong className="text-sm text-zinc-805">{folio.guest?.name}</strong>
                      </div>
                    </div>

                    {/* Inspection Status State Machine */}
                    {inspectionStatus === "none" && (
                      <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 text-center space-y-3">
                        <ShieldAlert className="h-10 w-10 text-amber-600 mx-auto" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pemeriksaan Kamar Diperlukan</h4>
                          <p className="text-[11px] text-amber-700 leading-relaxed max-w-xs mx-auto">
                            Sebelum memproses checkout, kamar harus diperiksa terlebih dahulu oleh staf Housekeeping untuk memastikan tidak ada kerusakan/kehilangan barang.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRequestInspection}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer border-0"
                        >
                          Minta Pemeriksaan Kamar (Request Inspection)
                        </button>
                      </div>
                    )}

                    {inspectionStatus === "pending" && (
                      <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 text-center space-y-3">
                        <RefreshCw className="h-10 w-10 text-blue-600 mx-auto animate-spin" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Kamar Sedang Diperiksa</h4>
                          <p className="text-[11px] text-blue-700 leading-relaxed max-w-xs mx-auto">
                            Tugas pemeriksaan kamar telah dikirim ke divisi Housekeeping. Mohon tunggu konfirmasi dari staf housekeeping lapangan.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={checkInspectionStatus}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5 mx-auto"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Cek Ulang Status
                        </button>
                      </div>
                    )}

                    {inspectionStatus === "completed" && (
                      <>
                        <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-3 flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Inspeksi Kamar Selesai</h4>
                            <p className="text-[10px] text-emerald-700 leading-relaxed">
                              Pemeriksaan kamar telah dikonfirmasi oleh Housekeeping. Semua denda kerusakan (jika ada) telah dimasukkan ke folio tagihan.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-450 font-bold uppercase tracking-wider">No. Folio: {folio.folio_number}</span>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white max-h-40 overflow-y-auto shadow-xs">
                            <table className="w-full text-left text-xs border-collapse text-zinc-650">
                              <thead className="bg-zinc-50 text-[9px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-200 sticky top-0">
                                <tr>
                                  <th className="p-2.5">Deskripsi Transaksi</th>
                                  <th className="p-2.5 text-right">Jumlah</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-200">
                                {folio.charges?.map((c) => (
                                  <tr key={c.id}>
                                    <td className="p-2.5 font-medium">{c.description}</td>
                                    <td className="p-2.5 text-right text-zinc-800">{formatRupiah(c.amount)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-xl border border-zinc-200 space-y-2 text-xs text-zinc-650">
                            <div className="flex justify-between">
                              <span>Total Biaya (Charges)</span>
                              <span className="font-semibold text-zinc-800">{formatRupiah(folio.total_charges)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Pembayaran</span>
                              <span className="font-semibold text-emerald-600">- {formatRupiah(folio.total_payments)}</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-200 pt-2 font-bold text-zinc-800">
                              <span>Sisa Tagihan Folio</span>
                              <span>{formatRupiah(folio.balance)}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions Step 1 */}
                  <div className="pt-3 border-t border-zinc-200 flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-655 text-sm font-medium hover:bg-zinc-50 cursor-pointer bg-transparent">
                      Tutup
                    </button>
                    {inspectionStatus === "completed" && (
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border-0"
                      >
                        Lanjut ke Settlement <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* === STEP 2: Settlement & Deposit Refund === */}
              {step === 2 && (
                <>
                  <div className="bg-slate-50 p-4 rounded-xl border border-zinc-200 space-y-3 text-xs text-zinc-650">
                    <h4 className="font-bold text-zinc-800 border-b border-zinc-200 pb-1.5">Rincian Finansial Akhir</h4>
                    <div className="flex justify-between">
                      <span>Tagihan Folio Kamar (Sebelum Denda)</span>
                      <span>{formatRupiah(folio.total_charges - totalDamage)}</span>
                    </div>
                    {totalDamage > 0 && (
                      <div className="flex justify-between text-amber-700 font-medium">
                        <span>Denda Kerusakan Kamar</span>
                        <span>+ {formatRupiah(totalDamage)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Total Pembayaran Selama Menginap</span>
                      <span className="text-emerald-600 font-medium">- {formatRupiah(folio.total_payments)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-zinc-800 pt-1.5 border-t border-zinc-150">
                      <span>Sisa Tagihan (Awal)</span>
                      <span>{formatRupiah(remainingBalance)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-blue-650">
                      <span>Uang Jaminan (Deposit) saat Check-in</span>
                      <span>- {formatRupiah(securityDeposit)}</span>
                    </div>
                    
                    {/* Hasil akhir */}
                    <div className="pt-2 border-t border-dashed border-zinc-300 space-y-2">
                      {depositRefund > 0 ? (
                        <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200">
                          <span className="font-extrabold flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" /> Pengembalian Uang Deposit (Refund)
                          </span>
                          <span className="text-sm font-black">{formatRupiah(depositRefund)}</span>
                        </div>
                      ) : amountToPay > 0 ? (
                        <div className="flex justify-between items-center bg-rose-50 text-rose-800 p-2.5 rounded-lg border border-rose-200">
                          <span className="font-extrabold flex items-center gap-1">
                            <ShieldAlert className="h-4 w-4" /> Sisa Tagihan (Harus Dibayar Tamu)
                          </span>
                          <span className="text-sm font-black">{formatRupiah(amountToPay)}</span>
                        </div>
                      ) : (
                        <div className="text-center font-extrabold text-zinc-700 py-1 bg-zinc-100 rounded-lg">
                          Semua Tagihan Lunas / Balance Rp0
                        </div>
                      )}
                    </div>
                  </div>

                  {amountToPay > 0 && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Metode Pembayaran Sisa Tagihan *</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 cursor-pointer"
                      >
                        <option value="cash">Cash / Tunai</option>
                        <option value="credit_card">Kartu Kredit</option>
                        <option value="debit">Debit</option>
                        <option value="transfer">Transfer Bank</option>
                        <option value="city_ledger">City Ledger (Perusahaan)</option>
                      </select>
                    </div>
                  )}

                  {depositRefund > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 font-medium">
                      ℹ️ Kembalikan deposit sebesar <strong>{formatRupiah(depositRefund)}</strong> secara tunai / sesuai metode deposit check-in kepada tamu.
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Catatan & Masukan Tamu (Komentar)</label>
                    <textarea
                      rows={2}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      placeholder="Masukkan saran, kritik, atau komentar dari pelanggan..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 text-zinc-800 bg-white outline-none focus:border-blue-600 resize-none"
                    />
                  </div>

                  {/* Actions Step 2 */}
                  <div className="pt-3 border-t border-zinc-200 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-655 text-sm font-medium hover:bg-zinc-50 cursor-pointer bg-transparent"
                    >
                      Kembali ke Step 1
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        "Proses Checkout"
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CheckOutModal;
