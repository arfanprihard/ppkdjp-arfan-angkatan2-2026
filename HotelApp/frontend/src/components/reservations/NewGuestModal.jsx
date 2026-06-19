import { useState } from "react";
import api from "../../api/axios";
import { User, X, AlertCircle, RefreshCw } from "lucide-react";

const NewGuestModal = ({ onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [idType, setIdType] = useState("ktp");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("Indonesia");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !idNumber) {
      setError("Nama dan Nomor Identitas wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/guests", {
        name,
        id_type: idType,
        id_number: idNumber,
        phone: phone || null,
        email: email || null,
        address: address || null,
        nationality: nationality || null,
      });
      if (res.data.success) {
        onSaved(res.data.data);
      } else {
        setError(res.data.message ?? "Gagal menambahkan tamu.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal menyimpan tamu baru.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <h4 className="text-base font-bold text-zinc-900">Daftarkan Tamu Baru</h4>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer border-0 bg-transparent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Tipe ID *</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none cursor-pointer"
              >
                <option value="ktp">KTP</option>
                <option value="passport">Passport</option>
                <option value="sim">SIM</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">No. Identitas *</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Contoh: 317101XXXXXXXXXX"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">No. Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812XXXXXXXX"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@example.com"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Kewarganegaraan</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Indonesia"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Alamat</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Merdeka No. 10"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-zinc-300 text-zinc-650 text-sm font-medium hover:bg-zinc-50 cursor-pointer text-center bg-transparent"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Tamu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGuestModal;
