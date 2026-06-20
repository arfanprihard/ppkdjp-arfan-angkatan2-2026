import { useState, useEffect } from "react";
import api from "../../api/axios";
import { AlertCircle, FileText, Printer, RefreshCw } from "lucide-react";

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const DailyReportSection = ({ endpoint, role }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(endpoint);
      if (res.data.success) {
        setReport(res.data.data);
      } else {
        setError("Gagal memuat data laporan.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal tersambung ke server untuk memuat laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [endpoint]);

  const handlePrint = () => {
    if (!report) return;

    const printWindow = window.open("", "_blank");
    const todayStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let contentHtml = "";

    if (role === "receptionist") {
      contentHtml = `
        <div class="summary">
          <div class="summary-card">
            <h4>Check-In Hari Ini</h4>
            <p>${report.summary.total_check_ins}</p>
          </div>
          <div class="summary-card">
            <h4>Check-Out Hari Ini</h4>
            <p>${report.summary.total_check_outs}</p>
          </div>
          <div class="summary-card">
            <h4>Reservasi Baru</h4>
            <p>${report.summary.total_reservations_created}</p>
          </div>
        </div>

        <div class="section-title">Daftar Tamu Check-In Hari Ini</div>
        <table>
          <thead>
            <tr>
              <th>Nama Tamu</th>
              <th>Kamar</th>
              <th>Waktu Check-In</th>
              <th>Jaminan Deposit</th>
            </tr>
          </thead>
          <tbody>
            ${
              report.check_ins.length === 0
                ? '<tr><td colspan="4" style="text-align:center;color:#888;">Tidak ada tamu check-in hari ini</td></tr>'
                : report.check_ins
                    .map(
                      (c) => `
              <tr>
                <td><strong>${c.reservation?.guest?.name || "Tamu"}</strong></td>
                <td>Kamar ${c.room?.room_number || "—"}</td>
                <td>${new Date(c.check_in_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                <td>${formatRupiah(c.deposit_amount)}</td>
              </tr>
            `
                    )
                    .join("")
            }
          </tbody>
        </table>

        <div class="section-title">Daftar Tamu Check-Out Hari Ini</div>
        <table>
          <thead>
            <tr>
              <th>Nama Tamu</th>
              <th>Kamar</th>
              <th>Waktu Check-Out</th>
              <th>Total Tagihan</th>
            </tr>
          </thead>
          <tbody>
            ${
              report.check_outs.length === 0
                ? '<tr><td colspan="4" style="text-align:center;color:#888;">Tidak ada tamu check-out hari ini</td></tr>'
                : report.check_outs
                    .map(
                      (c) => `
              <tr>
                <td><strong>${c.check_in?.reservation?.guest?.name || "Tamu"}</strong></td>
                <td>Kamar ${c.check_in?.room?.room_number || "—"}</td>
                <td>${new Date(c.check_out_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                <td>${formatRupiah(c.total_bill)}</td>
              </tr>
            `
                    )
                    .join("")
            }
          </tbody>
        </table>
      `;
    } else if (role === "housekeeping") {
      contentHtml = `
        <div class="summary">
          <div class="summary-card">
            <h4>Total Tugas Hari Ini</h4>
            <p>${report.summary.total_tasks}</p>
          </div>
          <div class="summary-card">
            <h4>Selesai</h4>
            <p>${report.summary.completed}</p>
          </div>
          <div class="summary-card">
            <h4>Sedang Dikerjakan / Menunggu</h4>
            <p>${report.summary.in_progress + report.summary.pending}</p>
          </div>
        </div>

        <div class="section-title">Daftar Pekerjaan Housekeeping Hari Ini</div>
        <table>
          <thead>
            <tr>
              <th>Kamar</th>
              <th>Jenis Tugas</th>
              <th>Petugas</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${
              report.tasks.length === 0
                ? '<tr><td colspan="6" style="text-align:center;color:#888;">Tidak ada pekerjaan housekeeping hari ini</td></tr>'
                : report.tasks
                    .map(
                      (t) => `
              <tr>
                <td><strong>Kamar ${t.room?.room_number || "—"}</strong></td>
                <td>${t.task_type}</td>
                <td>${t.assigned_staff?.name || "Belum ditugaskan"}</td>
                <td>${t.priority}</td>
                <td><span style="font-weight:bold;">${t.status.toUpperCase()}</span></td>
                <td>${t.notes || "—"}</td>
              </tr>
            `
                    )
                    .join("")
            }
          </tbody>
        </table>
      `;
    } else if (role === "fnb") {
      contentHtml = `
        <div class="summary" style="grid-template-columns: repeat(4, 1fr);">
          <div class="summary-card">
            <h4>Total Pesanan</h4>
            <p>${report.summary.total_orders}</p>
          </div>
          <div class="summary-card">
            <h4>Pendapatan Selesai</h4>
            <p>${formatRupiah(report.summary.total_revenue)}</p>
          </div>
          <div class="summary-card">
            <h4>Restoran</h4>
            <p>${report.summary.outlet_counts.resto}</p>
          </div>
          <div class="summary-card">
            <h4>Room Service</h4>
            <p>${report.summary.outlet_counts.room_service}</p>
          </div>
        </div>

        <div class="section-title">Daftar Pesanan Makanan & Minuman Hari Ini</div>
        <table>
          <thead>
            <tr>
              <th>No. Pesanan</th>
              <th>Kamar / Tamu</th>
              <th>Outlet</th>
              <th>Items Pesanan</th>
              <th>Status</th>
              <th>Total Harga</th>
            </tr>
          </thead>
          <tbody>
            ${
              report.orders.length === 0
                ? '<tr><td colspan="6" style="text-align:center;color:#888;">Tidak ada pesanan F&B hari ini</td></tr>'
                : report.orders
                    .map(
                      (o) => `
              <tr>
                <td><strong>#${o.order_number}</strong></td>
                <td>${o.room ? "Kamar " + o.room.room_number : "Walk-in"} / ${o.guest?.name || "Tamu Luar"}</td>
                <td>${o.outlet === "room_service" ? "Room Service" : "Restoran"}</td>
                <td>
                  ${o.items?.map((item) => `${item.item_name} (x${item.quantity})`).join(", ")}
                </td>
                <td><span style="font-weight:bold;">${o.status.toUpperCase()}</span></td>
                <td>${formatRupiah(o.total)}</td>
              </tr>
            `
                    )
                    .join("")
            }
          </tbody>
        </table>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Harian Divisi — PPKD Hotel</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; line-height: 1.4; }
            .header { text-align: center; border-bottom: 3px double #2563eb; padding-bottom: 12px; margin-bottom: 25px; }
            .header h1 { margin: 0; font-size: 26px; color: #1e3a8a; font-weight: 800; text-transform: uppercase; }
            .header p { margin: 5px 0 0; font-size: 13px; color: #555; }
            .meta { margin-bottom: 25px; font-size: 11px; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #666; }
            .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; margin-top: 25px; margin-bottom: 12px; border-left: 3px solid #2563eb; padding-left: 8px; color: #1e3a8a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 11px; }
            th, td { border: 1px solid #e5e7eb; padding: 9px; text-align: left; }
            th { background-color: #f9fafb; font-weight: bold; color: #374151; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 25px; }
            .summary-card { border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; background-color: #f9fafb; text-align: center; }
            .summary-card h4 { margin: 0; font-size: 9px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; }
            .summary-card p { margin: 6px 0 0; font-size: 20px; font-weight: 800; color: #111827; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 15px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PPKD Hotel</h1>
            <p>Sistem Informasi Manajemen Hotel</p>
          </div>
          <div class="meta">
            <div><strong>Divisi/Role:</strong> ${role === 'receptionist' ? 'Front Office / Resepsionis' : role === 'housekeeping' ? 'Housekeeping' : 'Food & Beverage Service'}</div>
            <div><strong>Tanggal Laporan:</strong> ${todayStr}</div>
          </div>
          
          ${contentHtml}

          <div class="footer">
            PPKD Hotel &copy; 2026 · Dokumen Laporan Resmi Internal Hotel
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm animate-pulse space-y-3">
        <div className="h-4 w-36 bg-slate-100 rounded" />
        <div className="h-10 bg-slate-100 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl text-xs flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-zinc-300 transition-all duration-300">
      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-zinc-900">
            Laporan Harian Aktivitas Staf
          </h3>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
        >
          <Printer className="h-3.5 w-3.5" /> Cetak Laporan
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {role === "receptionist" && (
          <>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Check-In Hari Ini</span>
              <span className="text-xl font-extrabold text-zinc-800 block mt-1">{report.summary.total_check_ins}</span>
            </div>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Check-Out Hari Ini</span>
              <span className="text-xl font-extrabold text-zinc-800 block mt-1">{report.summary.total_check_outs}</span>
            </div>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Reservasi Baru</span>
              <span className="text-xl font-extrabold text-zinc-800 block mt-1">{report.summary.total_reservations_created}</span>
            </div>
          </>
        )}

        {role === "housekeeping" && (
          <>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Total Tugas</span>
              <span className="text-xl font-extrabold text-zinc-800 block mt-1">{report.summary.total_tasks}</span>
            </div>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Selesai</span>
              <span className="text-xl font-extrabold text-zinc-800 block mt-1">{report.summary.completed}</span>
            </div>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Sisa Tugas</span>
              <span className="text-xl font-extrabold text-zinc-800 block mt-1">{report.summary.pending + report.summary.in_progress}</span>
            </div>
          </>
        )}

        {role === "fnb" && (
          <>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Total Pesanan</span>
              <span className="text-xl font-extrabold text-zinc-800 block mt-1">{report.summary.total_orders}</span>
            </div>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Pendapatan Selesai</span>
              <span className="text-xs font-black text-emerald-600 block mt-1 truncate">{formatRupiah(report.summary.total_revenue)}</span>
            </div>
            <div className="bg-slate-50 border border-zinc-150 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Outlet (Resto/Room)</span>
              <span className="text-sm font-extrabold text-zinc-800 block mt-1">
                {report.summary.outlet_counts.resto} / {report.summary.outlet_counts.room_service}
              </span>
            </div>
          </>
        )}
      </div>
      <p className="text-[10px] text-zinc-400 italic text-center">
        * Klik &quot;Cetak Laporan&quot; untuk mengunduh versi cetak PDF resmi dari aktivitas hari ini.
      </p>
    </div>
  );
};

export default DailyReportSection;
