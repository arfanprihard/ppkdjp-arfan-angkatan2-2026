<?php

namespace App\Http\Controllers;

use App\Models\HousekeepingTask;
use App\Models\Room;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\CheckIn;
use App\Models\GuestFolio;
use App\Models\FolioCharge;

class HousekeepingController extends Controller
{
    /**
     * Tampilkan semua tugas Housekeeping.
     */
    public function index(Request $request)
    {
        $query = HousekeepingTask::with(['room.roomType', 'assignedStaff']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tasks = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $tasks
        ], 200);
    }

    /**
     * Room Status Board (Peta kamar per lantai untuk grid visual dashboard HK).
     */
    public function roomBoard()
    {
        $rooms = Room::with([
            'roomType', 
            'housekeepingTasks' => function($query) {
                $query->whereIn('status', ['pending', 'in_progress'])->with('assignedStaff');
            }
        ])->get()->groupBy('floor');

        return response()->json([
            'success' => true,
            'data' => $rooms
        ], 200);
    }

    /**
     * Membuat tugas kebersihan kamar baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'task_type' => 'required|in:room_cleaning,turndown,deep_clean,pool,public_area,room_inspection,extra_bed,laundry',
            'priority' => 'required|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
            'extra_bed_price' => 'nullable|numeric|min:0',
            'extra_bed_qty' => 'nullable|integer|min:1',
            'laundry_desc' => 'nullable|string',
            'laundry_count' => 'nullable|integer|min:1',
            'laundry_price' => 'nullable|numeric|min:0',
        ]);

        $room = Room::find($request->room_id);

        return \DB::transaction(function () use ($request, $room) {
            if ($request->task_type === 'extra_bed') {
                $checkIn = CheckIn::where('room_id', $room->id)
                    ->whereHas('reservation', function($q) {
                        $q->where('status', 'checked_in');
                    })->first();

                if (!$checkIn) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Kamar #' . $room->room_number . ' tidak memiliki check-in aktif untuk pembebanan biaya extra bed.'
                    ], 400);
                }

                $folio = GuestFolio::where('check_in_id', $checkIn->id)->where('status', 'open')->first();
                if (!$folio) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Guest Folio aktif tidak ditemukan untuk kamar ini.'
                    ], 400);
                }

                $qty = intval($request->extra_bed_qty ?? 1);
                $unitPrice = floatval($request->extra_bed_price ?? 100000);
                $amount = $unitPrice * $qty;

                FolioCharge::create([
                    'folio_id' => $folio->id,
                    'charge_type' => 'extra_bed',
                    'description' => 'Layanan Tambahan - ' . $qty . 'x Extra Bed Kamar #' . $room->room_number,
                    'amount' => $amount,
                    'quantity' => $qty,
                    'charge_date' => Carbon::today(),
                    'created_by' => $request->user()->id,
                ]);

                $folio->increment('total_charges', $amount);
                $folio->refresh();
                $folio->update([
                    'balance' => $folio->total_charges - $folio->total_payments
                ]);

                $task = HousekeepingTask::create([
                    'room_id' => $room->id,
                    'task_type' => 'extra_bed',
                    'priority' => $request->priority,
                    'assigned_to' => $request->assigned_to,
                    'notes' => $request->notes ?? ('Siapkan dan antarkan ' . $qty . 'x extra bed ke Kamar #' . $room->room_number),
                    'status' => 'pending'
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Tugas Extra Bed berhasil dibuat & dibebankan ke folio tamu.',
                    'data' => $task
                ], 201);

            } elseif ($request->task_type === 'laundry') {
                $checkIn = CheckIn::where('room_id', $room->id)
                    ->whereHas('reservation', function($q) {
                        $q->where('status', 'checked_in');
                    })->first();

                if (!$checkIn) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Kamar #' . $room->room_number . ' tidak memiliki check-in aktif untuk pembebanan biaya laundry.'
                    ], 400);
                }

                $folio = GuestFolio::where('check_in_id', $checkIn->id)->where('status', 'open')->first();
                if (!$folio) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Guest Folio aktif tidak ditemukan untuk kamar ini.'
                    ], 400);
                }

                $itemsDesc = $request->laundry_desc ?? 'Laundry Service';
                $itemCount = intval($request->laundry_count ?? 1);
                $totalCharge = floatval($request->laundry_price ?? 0);

                $laundry = \App\Models\LaundryRequest::create([
                    'guest_id' => $checkIn->reservation->guest_id,
                    'room_id' => $room->id,
                    'items_description' => $itemsDesc,
                    'item_count' => $itemCount,
                    'total_charge' => $totalCharge,
                    'status' => 'received',
                    'received_at' => Carbon::now()
                ]);

                FolioCharge::create([
                    'folio_id' => $folio->id,
                    'charge_type' => 'laundry',
                    'description' => 'Layanan Laundry - ' . $itemCount . ' Pcs (' . $itemsDesc . ')',
                    'amount' => $totalCharge,
                    'quantity' => 1,
                    'charge_date' => Carbon::today(),
                    'reference_id' => $laundry->id,
                    'reference_type' => \App\Models\LaundryRequest::class,
                    'created_by' => $request->user()->id,
                ]);

                $folio->increment('total_charges', $totalCharge);
                $folio->refresh();
                $folio->update([
                    'balance' => $folio->total_charges - $folio->total_payments
                ]);

                $task = HousekeepingTask::create([
                    'room_id' => $room->id,
                    'task_type' => 'laundry',
                    'priority' => $request->priority,
                    'assigned_to' => $request->assigned_to,
                    'notes' => $request->notes ?? ('Ambil laundry: ' . $itemsDesc),
                    'status' => 'pending'
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Tugas Laundry berhasil dibuat & dibebankan ke folio tamu.',
                    'data' => $task
                ], 201);
            } else {
                $task = HousekeepingTask::create([
                    'room_id' => $request->room_id,
                    'task_type' => $request->task_type,
                    'priority' => $request->priority,
                    'assigned_to' => $request->assigned_to,
                    'notes' => $request->notes,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Tugas Housekeeping berhasil dibuat.',
                    'data' => $task
                ], 201);
            }
        });
    }

    /**
     * Mengupdate status tugas (pending -> in_progress -> completed).
     * Jika status diupdate ke 'completed', otomatis bersihkan status kamar fisiknya.
     */
    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled'
        ]);

        $task = HousekeepingTask::find($id);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Tugas tidak ditemukan.'
            ], 404);
        }

        $task->status = $request->status;

        // Otomatis tugaskan ke akun yang sedang login jika status diubah ke in_progress atau completed
        if (in_array($request->status, ['in_progress', 'completed'])) {
            $task->assigned_to = $request->user()->id;
        }

        if ($request->status === 'completed') {
            $task->completed_at = Carbon::now();

            // Logika Otomatisasi Kamar Berdasarkan Diagram Alur PRD:
            // Jika kamar kotor (VD/OD) dan pembersihan selesai -> ubah jadi bersih (VC/OC)
            $room = Room::find($task->room_id);
            if ($room->status === 'vd') {
                $room->update(['status' => 'vc']); // Vacant Dirty -> Vacant Clean (Siap dijual kembali)
            } elseif ($room->status === 'od') {
                $room->update(['status' => 'oc']); // Occupied Dirty -> Occupied Clean
            }
        }

        $task->save();

        // Jika ada data damage charge, masukkan ke folio tamu
        if ($request->status === 'completed' && $request->has('damage_charges') && is_array($request->damage_charges)) {
            // Saring denda yang valid (nominal > 0 dan nama barang terisi)
            $validCharges = array_filter($request->damage_charges, function($d) {
                return !empty($d['item_name']) && floatval($d['amount'] ?? 0) > 0;
            });

            if (count($validCharges) > 0) {
                // Cari check-in aktif untuk kamar ini
                $checkIn = CheckIn::where('room_id', $task->room_id)
                    ->whereHas('reservation', function($q) {
                        $q->where('status', 'checked_in');
                    })->first();

                if (!$checkIn) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Gagal menyimpan denda. Kamar ini tidak memiliki tamu aktif (sudah checkout).'
                    ], 422);
                }

                $folio = GuestFolio::where('check_in_id', $checkIn->id)->where('status', 'open')->first();
                if (!$folio) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Gagal menyimpan denda. Folio tagihan kamar ini sudah ditutup.'
                    ], 422);
                }

                foreach ($validCharges as $damage) {
                    $amount = floatval($damage['amount']);
                    FolioCharge::create([
                        'folio_id' => $folio->id,
                        'charge_type' => 'other',
                        'description' => 'Denda Kerusakan/Kehilangan: ' . $damage['item_name'],
                        'amount' => $amount,
                        'quantity' => 1,
                        'charge_date' => Carbon::today(),
                        'created_by' => $request->user()->id,
                    ]);

                    $folio->increment('total_charges', $amount);
                    $folio->refresh();
                    $folio->update([
                        'balance' => $folio->total_charges - $folio->total_payments
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Status tugas berhasil diperbarui.',
            'data' => $task
        ], 200);
    }
}
