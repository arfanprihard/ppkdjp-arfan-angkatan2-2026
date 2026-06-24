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
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'task_type' => 'required|in:room_cleaning,turndown,deep_clean,pool,public_area,room_inspection',
            'priority' => 'required|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $task = HousekeepingTask::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tugas Housekeeping berhasil dibuat.',
            'data' => $task
        ], 201);
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
