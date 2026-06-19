import React, { useState, useEffect, useCallback } from "react";
import { User, X, AlertCircle, Phone, Mail, MapPin, History, RefreshCw } from "lucide-react";
import api from "../../api/axios";
import { getResStatusBadge, formatRupiah, getNights } from "./helpers";

const GuestDetailModal = ({ guestId, onClose }) => {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/guests/${guestId}`);
      if (res.data.success) {
        setGuest(res.data.data);
      } else {
        setError("Gagal memuat detail tamu.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungkan ke backend.");
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-zinc-900">Profil Tamu Lengkap</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4 py-8 animate-pulse">
              <div className="h-8 bg-zinc-100 rounded-xl w-1/3" />
              <div className="h-24 bg-zinc-100 rounded-xl" />
              <div className="h-40 bg-zinc-100 rounded-xl" />
            </div>
          ) : (
            guest && (
              <>
                {/* Profile Detail Grid */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-lg font-extrabold text-zinc-900">{guest.name}</h4>
                    <span className="text-[10px] bg-white text-zinc-600 border border-zinc-200 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider shadow-xs">
                      {guest.id_type?.toUpperCase()}: {guest.id_number}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-sm text-zinc-700">
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                      <span>{guest.phone || "— (Belum diisi)"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                      <span>{guest.email || "— (Belum diisi)"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                      <span>{guest.nationality || "Indonesia"}</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:col-span-2">
                      <MapPin className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{guest.address || "— (Alamat belum diisi)"}</span>
                    </div>
                  </div>
                </div>

                {/* History Reservasi */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5 text-blue-600" /> Riwayat Reservasi Tamu
                  </p>

                  {!guest.reservations || guest.reservations.length === 0 ? (
                    <div className="text-center py-8 text-xs text-zinc-500 bg-white border border-zinc-200 rounded-xl shadow-xs">
                      Belum ada riwayat reservasi untuk tamu ini.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-xs max-h-56 overflow-y-auto">
                      <table className="w-full border-collapse text-left text-xs text-zinc-600">
                        <thead className="bg-zinc-50 text-[9px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-200 sticky top-0">
                          <tr>
                            <th className="p-3">Kode Booking</th>
                            <th className="p-3">Kamar</th>
                            <th className="p-3">Tanggal Stay</th>
                            <th className="p-3">Total Tagihan</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                          {guest.reservations.map((res) => (
                            <tr key={res.id} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-zinc-900">{res.reservation_code}</td>
                              <td className="p-3 text-zinc-700">
                                {res.room ? `No. ${res.room.room_number}` : "Belum ditentukan"}
                              </td>
                              <td className="p-3 text-zinc-500">
                                {res.check_in_date}
                                <span className="block text-[10px] text-zinc-400 mt-0.5">
                                  {getNights(res.check_in_date, res.check_out_date)} malam
                                </span>
                              </td>
                              <td className="p-3 font-semibold text-zinc-800">{formatRupiah(res.total_amount)}</td>
                              <td className="p-3">
                                <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest ${getResStatusBadge(res.status)}`}>
                                  {res.status.replace("_", " ")}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-zinc-200 flex justify-end">
                  <button
                    onClick={onClose}
                    className="py-2 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestDetailModal;
