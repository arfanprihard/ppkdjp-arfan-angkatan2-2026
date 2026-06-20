import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  X,
  AlertCircle,
  CheckCircle,
  User,
  Building,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Edit2,
  RefreshCw,
  Printer
} from "lucide-react";
import {
  RESERVATION_STATUSES,
  getStatus,
  getChannelLabel,
  formatRupiah,
  getNights
} from "./helpers";

const ReservationDetailModal = ({
  reservation,
  rooms,
  onClose,
  onUpdated,
  onCheckInClick,
  onCheckOutClick
}) => {
  const [editing, setEditing] = useState(false);
  const [roomId, setRoomId] = useState(reservation.room_id || "");
  const [roomTypeId, setRoomTypeId] = useState(reservation.room_type_id || "");
  const [checkInDate, setCheckInDate] = useState(reservation.check_in_date || "");
  const [checkOutDate, setCheckOutDate] = useState(reservation.check_out_date || "");
  const [numAdults, setNumAdults] = useState(reservation.num_adults || 1);
  const [numChildren, setNumChildren] = useState(reservation.num_children || 0);
  const [status, setStatus] = useState(reservation.status || "pending");
  const [specialRequest, setSpecialRequest] = useState(reservation.special_request || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [allReservations, setAllReservations] = useState([]);

  useEffect(() => {
    const fetchAllReservations = async () => {
      try {
        const res = await api.get("/api/reservations?all=1");
        if (res.data.success) {
          setAllReservations(res.data.data || []);
        }
      } catch (err) {
        console.error("Gagal mengambil data reservasi untuk filter kamar", err);
      }
    };
    fetchAllReservations();
  }, []);

  const s = getStatus(reservation.status);

  // Auto-dedupe room types from rooms
  const roomTypes = [...new Map(rooms.map((r) => [r.room_type?.id || r.roomType?.id, r.room_type || r.roomType])).values()].filter(Boolean);

  // Calculate available room types on selected dates (ignoring current reservation)
  const availableRoomTypes = roomTypes.filter((t) => {
    if (!checkInDate || !checkOutDate) {
      return false;
    }
    const start1 = new Date(checkInDate);
    const end1 = new Date(checkOutDate);

    // Total rooms of this type
    const roomsOfType = rooms.filter((r) => String(r.room_type?.id || r.roomType?.id) === String(t.id));
    const totalRoomsCount = roomsOfType.length;

    // Overlapping reservations for this room type (ignoring this reservation)
    const activeOverlapping = allReservations.filter((res) => {
      if (Number(res.id) === Number(reservation.id)) {
        return false;
      }
      if (['cancelled', 'no_show', 'checked_out'].includes(res.status)) {
        return false;
      }
      if (String(res.room_type_id) !== String(t.id)) {
        return false;
      }
      const start2 = new Date(res.check_in_date);
      const end2 = new Date(res.check_out_date);
      return start1 < end2 && end1 > start2;
    });

    const availableCount = totalRoomsCount - activeOverlapping.length;
    return availableCount > 0;
  });

  const isFinalState = ["checked_out", "cancelled"].includes(reservation.status);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      setError("Isi tanggal Check-in dan Check-out.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        room_type_id: Number(roomTypeId),
        room_id: reservation.status === "checked_in" ? (roomId ? Number(roomId) : null) : null,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_adults: Number(numAdults),
        num_children: Number(numChildren),
        status,
        special_request: specialRequest || null,
      };

      const res = await api.put(`/api/reservations/${reservation.id}`, payload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdated();
        }, 800);
      } else {
        setError(res.data.message ?? "Gagal menyimpan perubahan.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await api.patch(`/api/reservations/${reservation.id}/cancel`);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdated();
        }, 800);
      } else {
        setError(res.data.message ?? "Gagal membatalkan reservasi.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal membatalkan reservasi.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const todayStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const isWalkIn = reservation.channel === "walk_in";
    const totalNights = getNights(reservation.check_in_date, reservation.check_out_date);
    const guestName = reservation.guest?.name ?? "—";
    const guestPhone = reservation.guest?.phone ?? "—";
    const guestEmail = reservation.guest?.email ?? "—";
    const guestAddress = reservation.guest?.address ?? "—";
    const guestNationality = reservation.guest?.nationality ?? "—";
    const idType = (reservation.guest?.id_type || "KTP").toUpperCase();
    const idNumber = reservation.guest?.id_number ?? "—";
    const roomNumber = reservation.room?.room_number ?? "—";
    const roomTypeName = reservation.room_type?.name || reservation.roomType?.name || "—";
    const totalAmountStr = formatRupiah(reservation.total_amount);
    const creatorName = reservation.creator?.name || "Resepsionis";

    const depositAmount = reservation.check_in?.deposit_amount || reservation.checkIn?.deposit_amount || 0;
    const depositMethod = reservation.check_in?.deposit_method || reservation.checkIn?.deposit_method || "cash";

    let contentHtml = "";

    if (isWalkIn) {
      contentHtml = `
        <div class="header">
          <h1>PPKD Hotel</h1>
          <p>Formulir Pendaftaran / Registration Form</p>
        </div>
        
        <table class="info-table">
          <tr>
            <td class="label">Room No. <span class="sub-label">No. Kamar</span></td>
            <td class="val"><strong>${roomNumber}</strong></td>
            <td class="label">No. of Person <span class="sub-label">Jumlah Tamu</span></td>
            <td class="val">${reservation.num_adults + reservation.num_children} Orang / Person(s)</td>
          </tr>
          <tr>
            <td class="label">No. of Room <span class="sub-label">Jumlah Kamar</span></td>
            <td class="val">1</td>
            <td class="label">Room Type <span class="sub-label">Tipe Kamar</span></td>
            <td class="val">${roomTypeName}</td>
          </tr>
        </table>
        
        <div style="text-align: right; font-size: 10px; margin-bottom: 10px; font-weight: bold;">
          Check Out Time: 12.00 Noon / Waktu Lapor Keluar: Jam 12.00 Siang
        </div>
        <div style="font-size: 11px; font-style: italic; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">
          Harap tulis dengan huruf cetak — Please print in block letters
        </div>

        <table class="info-table">
          <tr>
            <td class="label">Name <span class="sub-label">Nama</span></td>
            <td colspan="3"><strong>${guestName}</strong></td>
          </tr>
          <tr>
            <td class="label">Profession <span class="sub-label">Pekerjaan</span></td>
            <td class="val">_______________________</td>
            <td class="label">Company <span class="sub-label">Perusahaan</span></td>
            <td class="val">_______________________</td>
          </tr>
          <tr>
            <td class="label">Arrival Date <span class="sub-label">Tanggal Kedatangan</span></td>
            <td class="val">${reservation.check_in_date || "—"}</td>
            <td class="label">Arrival Time <span class="sub-label">Waktu Kedatangan</span></td>
            <td class="val">_______________________</td>
          </tr>
          <tr>
            <td class="label">Nationality <span class="sub-label">Kebangsaan</span></td>
            <td class="val">${guestNationality}</td>
            <td class="label">Birth Date <span class="sub-label">Tanggal Lahir</span></td>
            <td class="val">_______________________</td>
          </tr>
          <tr>
            <td class="label">ID Type & Number <span class="sub-label">No. Identitas (${idType})</span></td>
            <td colspan="3">${idNumber}</td>
          </tr>
          <tr>
            <td class="label">Address <span class="sub-label">Alamat</span></td>
            <td colspan="3">${guestAddress}</td>
          </tr>
          <tr>
            <td class="label">Phone / Handphone <span class="sub-label">No. Telepon / HP</span></td>
            <td class="val">${guestPhone}</td>
            <td class="label">Email <span class="sub-label">Alamat Email</span></td>
            <td class="val">${guestEmail}</td>
          </tr>
          <tr>
            <td class="label">Departure Date <span class="sub-label">Tgl Keberangkatan</span></td>
            <td class="val">${reservation.check_out_date || "—"}</td>
            <td class="label">Member Card No. <span class="sub-label">No. Kartu Member</span></td>
            <td class="val">_______________________</td>
          </tr>
          <tr>
            <td class="label">Method of Payment <span class="sub-label">Cara Pembayaran</span></td>
            <td colspan="3">
              [ ${depositMethod === "visa" ? "X" : " "} ] VISA &nbsp;&nbsp;&nbsp;&nbsp;
              [ ${depositMethod === "debit" ? "X" : " "} ] Debit Card &nbsp;&nbsp;&nbsp;&nbsp;
              [ ${(depositMethod === "cash" || !depositMethod) ? "X" : " "} ] Cash &nbsp;&nbsp;&nbsp;&nbsp;
              [ ${depositMethod === "other" ? "X" : " "} ] Other
            </td>
          </tr>
        </table>

        <div class="terms">
          <p><strong>Kepada PPKD Hotel</strong>, Saya menyatakan bahwa saya baik sendiri ataupun bersama-sama dengan perusahaan, asosiasi, perorangan atau semuanya bertanggung jawab atas pembayaran semua tagihan yang terjadi sehubungan dengan seluruh pelayanan yang Anda berikan sesuai formulir pendaftaran ini.</p>
          <p><strong>To PPKD Hotel</strong>: I acknowledge that I'm jointly and severally liable with the fore-going person, company or association (and if more than one all of them) for payment of the amount of any charges payable or incurred in connection with all services provided by you under registration.</p>
          <p style="margin-top: 6px;"><strong>Peraturan Hotel / Hotel Regulations:</strong></p>
          <ul style="margin: 0; padding-left: 15px;">
            <li>Untuk diketahui bahwa anda tidak diperkenankan untuk membawa durian ke area hotel. / <em>Please be informed that you are not allowed to bring Durian into the hotel premises.</em></li>
            <li>Barang berharga (perhiasan, uang dsb) dapat anda simpan dalam brankas di kamar anda atau di kantor depan. / <em>For your valuable belongings (jewels, money, etc) could be stored in the safe deposit box in your room or in the front office.</em></li>
            <li>Kamar ini bebas rokok. Denda sebesar Rp 1.000.000,- akan ditagihkan apabila Anda merokok di kamar ini. / <em>This room is designed as a non-smoking room. A fine of IDR 1,000,000 will be charged for smoking in this room.</em></li>
          </ul>
        </div>

        <table class="info-table" style="margin-top: 10px;">
          <tr>
            <td class="label" style="width: 25%;">Safety Deposit Box Number <span class="sub-label">Nomor Kotak Deposit</span></td>
            <td style="width: 25%;">_________________</td>
            <td class="label" style="width: 20%;">Issued / Dikeluarkan oleh</td>
            <td style="width: 30%;">_________________</td>
          </tr>
        </table>

        <div class="signatures">
          <div class="sig-block">
            <div class="sig-label">Tanda Tangan Tamu</div>
            <div class="sig-sub">Guest Signature</div>
            <div class="sig-line"></div>
          </div>
          <div class="sig-block">
            <div class="sig-label">Front Office Staff (Check In)</div>
            <div class="sig-sub">Melapor masuk oleh: ${creatorName}</div>
            <div class="sig-line"></div>
          </div>
          <div class="sig-block">
            <div class="sig-label">Front Office Staff (Check Out)</div>
            <div class="sig-sub">Melapor keluar oleh</div>
            <div class="sig-line"></div>
          </div>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="header">
          <h1>PPKD Hotel</h1>
          <p>Sistem Informasi Manajemen Hotel / Hotel Confirmation</p>
        </div>
        
        <div class="conf-title">Reservation Confirmation</div>
        
        <table class="conf-table">
          <tr>
            <td class="label">To.</td>
            <td class="val">${guestName}</td>
            <td class="label">Date</td>
            <td class="val">${todayStr}</td>
          </tr>
          <tr>
            <td class="label">Company / Agent</td>
            <td class="val">${reservation.channel === "ota" ? reservation.ota_name : getChannelLabel(reservation.channel)}</td>
            <td class="label">Booking No.</td>
            <td class="val"><strong>${reservation.reservation_code}</strong></td>
          </tr>
          <tr>
            <td class="label">Book By</td>
            <td class="val">${creatorName}</td>
            <td class="label">Phone</td>
            <td class="val">${guestPhone}</td>
          </tr>
          <tr>
            <td class="label">Email</td>
            <td class="val">${guestEmail}</td>
            <td class="label">Status</td>
            <td class="val"><span style="text-transform: uppercase; font-weight: bold;">${reservation.status}</span></td>
          </tr>
        </table>

        <div class="details-title">Detail Reservasi / Reservation Details</div>
        <table class="conf-table">
          <tr>
            <td class="label">Guest Name</td>
            <td class="val-wide" colspan="3"><strong>${guestName}</strong></td>
          </tr>
          <tr>
            <td class="label">Arrival Date</td>
            <td class="val">${reservation.check_in_date || "—"}</td>
            <td class="label">Departure Date</td>
            <td class="val">${reservation.check_out_date || "—"}</td>
          </tr>
          <tr>
            <td class="label">Total Nights</td>
            <td class="val">${totalNights} Night(s)</td>
            <td class="label">Person Pax</td>
            <td class="val">${reservation.num_adults} Dewasa (Adult) ${reservation.num_children > 0 ? `, ${reservation.num_children} Anak (Child)` : ""}</td>
          </tr>
          <tr>
            <td class="label">Room Type</td>
            <td class="val">${roomTypeName}</td>
            <td class="label">Room Rate Net</td>
            <td class="val"><strong>${totalAmountStr}</strong></td>
          </tr>
          ${reservation.special_request ? `
          <tr>
            <td class="label">Special Request</td>
            <td class="val-wide" colspan="3" style="font-style: italic; color: #555;">${reservation.special_request}</td>
          </tr>
          ` : ""}
        </table>

        <div class="policy-section">
          <h4>Payment & Guarantee Policy</h4>
          <p>Please guarantee this booking with credit card number with clear copy of the card both sides and card holder signature in the column provided. The copy of credit card both sides should be faxed/emailed to hotel.</p>
          
          <div class="bank-details">
            <strong>Please settle your outstanding to our account:</strong><br/>
            Bank Transfer<br/>
            Mandiri Account: <strong>123-456-789-0</strong><br/>
            Mandiri Name Account: <strong>PPKD Hotel</strong>
          </div>
        </div>

        <div class="credit-card-form">
          <strong>Reservation guaranteed by the following credit card / bank transfer:</strong>
          <table style="width: 100%; border: none; margin-top: 10px; font-size: 11px;">
            <tr>
              <td style="width: 25%; padding: 4px 0; border: none;">Card Number:</td>
              <td style="width: 25%; border-bottom: 1px solid #333;"></td>
              <td style="width: 25%; padding: 4px 0; border: none;">Card Holder Name:</td>
              <td style="width: 25%; border-bottom: 1px solid #333;"></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; border: none;">Card Type:</td>
              <td style="border-bottom: 1px solid #333;"></td>
              <td style="padding: 4px 0; border: none;">Expired Date (MM/YY):</td>
              <td style="border-bottom: 1px solid #333;"></td>
            </tr>
          </table>
          <div style="margin-top: 25px; display: flex; justify-content: flex-end;">
            <div style="width: 40%; text-align: center;">
              <div style="font-style: italic;">Card Holder Signature</div>
              <div style="margin-top: 40px; border-top: 1px solid #333;"></div>
            </div>
          </div>
        </div>

        <div class="policy-section" style="margin-top: 15px;">
          <h4>Cancellation Policy</h4>
          <ol>
            <li>Please note that check in time is 02.00 pm and check out time is 12.00 pm.</li>
            <li>All non-guaranteed reservations will automatically be released at 6.00 pm.</li>
            <li>The Hotel will charge 1 night for guaranteed reservations that have not been cancelled before the day of arrival. Please carefully note your cancellation number.</li>
          </ol>
        </div>

        <div class="signature-area">
          <div class="sig-box">
            <div style="font-weight: bold;">Prepared By</div>
            <div style="font-size: 10px; color: #555;">Front Office Dept.</div>
            <div class="sig-line"></div>
            <div style="font-size: 11px; margin-top: 5px;">${creatorName}</div>
          </div>
          <div class="sig-box">
            <div style="font-weight: bold;">Confirmed By</div>
            <div style="font-size: 10px; color: #555;">Guest / Agent Representative</div>
            <div class="sig-line"></div>
            <div style="font-size: 11px; margin-top: 5px;">${guestName}</div>
          </div>
        </div>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Reservasi ${reservation.reservation_code} — PPKD Hotel</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #333; line-height: 1.4; font-size: 12px; }
            .header { text-align: center; border-bottom: 3px double #2563eb; padding-bottom: 10px; margin-bottom: 15px; }
            .header h1 { margin: 0; font-size: 24px; color: #1e3a8a; font-weight: bold; text-transform: uppercase; }
            .header p { margin: 3px 0 0; font-size: 11px; color: #555; text-transform: uppercase; font-weight: bold; }
            .form-title { text-align: center; font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 12px 0; }
            .conf-title { text-align: center; font-size: 16px; font-weight: 800; text-transform: uppercase; color: #1e3a8a; margin: 15px 0; }
            
            table.info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
            table.info-table td { border: 1px solid #333; padding: 5px 8px; vertical-align: top; }
            table.info-table td.label { font-weight: bold; width: 25%; background-color: #f9fafb; }
            table.info-table td.val { width: 25%; }
            
            table.conf-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            table.conf-table td { padding: 6px 10px; vertical-align: top; border-bottom: 1px solid #e5e7eb; }
            table.conf-table td.label { font-weight: bold; color: #4b5563; width: 25%; }
            table.conf-table td.val { color: #111827; width: 25%; }
            table.conf-table td.val-wide { color: #111827; width: 75%; }
            
            .sub-label { display: block; font-size: 9px; font-weight: normal; font-style: italic; color: #666; margin-top: 1px; }
            .details-title { font-weight: bold; font-size: 12px; text-transform: uppercase; color: #1e3a8a; margin-top: 20px; margin-bottom: 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 3px; }
            
            .terms { font-size: 8.5px; line-height: 1.3; text-align: justify; margin-top: 12px; color: #333; border-top: 1px solid #333; padding-top: 6px; }
            .terms p { margin: 0 0 5px 0; }
            
            .policy-section { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; font-size: 10px; margin-top: 15px; color: #4b5563; }
            .policy-section h4 { margin: 0 0 8px 0; color: #1e3a8a; font-size: 11px; text-transform: uppercase; }
            .policy-section ol { margin: 0; padding-left: 15px; }
            .policy-section li { margin-bottom: 4px; }
            
            .bank-details { margin-top: 10px; border-top: 1px dashed #d1d5db; padding-top: 8px; }
            .credit-card-form { margin-top: 15px; border: 1px solid #333; padding: 10px; font-size: 10px; }
            
            .signatures { display: flex; justify-content: space-between; margin-top: 20px; }
            .sig-block { text-align: center; width: 30%; }
            .sig-line { margin-top: 40px; border-top: 1px solid #333; width: 100%; }
            .sig-label { font-size: 10px; font-weight: bold; margin-top: 3px; }
            .sig-sub { font-size: 8.5px; font-style: italic; color: #666; }
            
            .signature-area { display: flex; justify-content: space-between; margin-top: 30px; }
            .sig-box { text-align: center; width: 40%; }
            .sig-line { margin-top: 45px; border-top: 1px solid #333; }
            
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${contentHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-255">
        {/* Header */}
        <div className={`p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50`}>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${s.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <h3 className="text-xl font-extrabold text-zinc-900 mt-1.5">{reservation.reservation_code}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer border-0 bg-transparent">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs mb-4 animate-in fade-in">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Perubahan berhasil disimpan!
            </div>
          )}

          {!editing ? (
            // VIEW MODE
            <div className="space-y-5">
              {/* Guest & Room Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-zinc-200 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                    <User className="h-3 w-3" /> Data Tamu
                  </p>
                  <div>
                    <p className="text-sm font-extrabold text-zinc-900">{reservation.guest?.name ?? "—"}</p>
                    <p className="text-xs text-zinc-500 mt-1">{reservation.guest?.id_type?.toUpperCase()}: {reservation.guest?.id_number}</p>
                    <p className="text-xs text-zinc-500 mt-1">Telp: {reservation.guest?.phone || "—"}</p>
                    <p className="text-xs text-zinc-500 mt-1">Email: {reservation.guest?.email || "—"}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-zinc-200 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                    <Building className="h-3 w-3" /> Info Alokasi Kamar
                  </p>
                  <div>
                    <p className="text-sm font-extrabold text-zinc-900">
                      {reservation.room_type?.name || reservation.roomType?.name || "—"}
                    </p>
                    <p className="text-xs text-zinc-550 mt-1">
                      Kamar: {reservation.room ? `Nomor ${reservation.room.room_number} (Lantai ${reservation.room.floor})` : "Unassigned (Belum ditentukan)"}
                    </p>
                    <p className="text-xs text-zinc-550 mt-1">Biaya: {formatRupiah(reservation.total_amount)}</p>
                    <p className="text-xs text-zinc-550 mt-1">Booking via: <span className="font-bold text-blue-600">{getChannelLabel(reservation.channel)} {reservation.ota_name ? `(${reservation.ota_name})` : ""}</span></p>
                  </div>
                </div>
              </div>

              {/* Checkin / Checkout Stay Dates */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-zinc-200 flex justify-between items-center text-center">
                <div className="flex-1 text-left sm:text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Check In</p>
                  <p className="text-sm font-bold text-zinc-900">{reservation.check_in_date}</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <ArrowRight className="h-4 w-4 text-zinc-400" />
                  <span className="text-[10px] text-zinc-600 font-bold bg-white px-2 py-0.5 rounded-full mt-1 border border-zinc-200 shadow-xs">
                    {getNights(reservation.check_in_date, reservation.check_out_date)} Malam
                  </span>
                </div>
                <div className="flex-1 text-right sm:text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Check Out</p>
                  <p className="text-sm font-bold text-zinc-900">{reservation.check_out_date}</p>
                </div>
              </div>

              {/* Guest Counts & Special Requests */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-zinc-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 mb-2">
                    <Users className="h-3 w-3" /> Jumlah Tamu
                  </p>
                  <p className="text-sm font-bold text-zinc-800">
                    {reservation.num_adults} Dewasa {reservation.num_children > 0 && `, ${reservation.num_children} Anak`}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-zinc-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 mb-2">
                    <Briefcase className="h-3 w-3" /> Petugas Pembuat
                  </p>
                  <p className="text-sm font-bold text-zinc-800">
                    {reservation.creator?.name || "Sistem"}
                  </p>
                </div>
              </div>

              {reservation.special_request && (
                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-700 mb-2">Permintaan Khusus</p>
                  <p className="text-sm text-rose-805 italic leading-relaxed">{reservation.special_request}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-200 flex flex-wrap gap-2 justify-end">
                {/* Check-In Button */}
                {["confirmed", "pending"].includes(reservation.status) && (
                  <button
                    type="button"
                    onClick={() => onCheckInClick(reservation)}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all duration-200 cursor-pointer border-0 flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Check-In Tamu
                  </button>
                )}

                {/* Check-Out Button */}
                {reservation.status === "checked_in" && (
                  <button
                    type="button"
                    onClick={() => onCheckOutClick(reservation)}
                    className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all duration-200 cursor-pointer border-0 flex items-center gap-1.5 shadow-sm"
                  >
                    <X className="h-4 w-4" /> Check-Out & Settle
                  </button>
                )}

                {/* Cancel Reservation */}
                {!["checked_in", "checked_out", "cancelled"].includes(reservation.status) && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="py-2.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all duration-200 cursor-pointer bg-white flex items-center gap-1.5 shadow-xs"
                  >
                    <Trash2 className="h-4 w-4" /> Batalkan Reservasi
                  </button>
                )}

                {/* Edit Form Toggle */}
                {!isFinalState && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-all duration-200 cursor-pointer border-0 flex items-center gap-1.5 shadow-xs"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Detail
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all duration-200 cursor-pointer border border-blue-200 flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="h-4 w-4" /> Cetak Dokumen
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer border-0 shadow-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            // EDIT MODE
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Checkin / Checkout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Check In</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-305 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Check Out</label>
                  <input
                    type="date"
                    required
                    min={checkInDate}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-305 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
                  />
                </div>
              </div>

              {/* Room Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Tipe Kamar</label>
                <select
                  disabled={!checkInDate || !checkOutDate}
                  value={roomTypeId}
                  onChange={(e) => setRoomTypeId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-305 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {!checkInDate || !checkOutDate ? (
                    <option value="">-- Pilih Tanggal Terlebih Dahulu --</option>
                  ) : (
                    <>
                      <option value="">-- Pilih Tipe Kamar --</option>
                      {availableRoomTypes.map((t) => (
                        <option key={t.id} value={t.id}>{t.name} ({formatRupiah(t.base_price)})</option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* Guests and Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Dewasa</label>
                  <input
                    type="number"
                    min={1}
                    value={numAdults}
                    onChange={(e) => setNumAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-305 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Anak</label>
                  <input
                    type="number"
                    min={0}
                    value={numChildren}
                    onChange={(e) => setNumChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-305 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-350 bg-white text-zinc-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
                  >
                    {RESERVATION_STATUSES.map((st) => (
                      <option key={st.key} value={st.key}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Requests */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Permintaan Khusus</label>
                <textarea
                  rows={2}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Contoh: AC dingin, extra bed..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-305 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 resize-none"
                />
              </div>

              {/* Edit Buttons */}
              <div className="pt-4 border-t border-zinc-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-600 text-sm font-medium hover:bg-zinc-50 cursor-pointer bg-transparent"
                >
                  Kembali ke Detail
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
