<?php

namespace App\Http\Controllers;

use App\Models\HousekeepingTask;
use App\Models\Room;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
        $rooms = Room::with('roomType')->get()->groupBy('floor');

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
            'task_type' => 'required|in:room_cleaning,turndown,deep_clean,pool,public_area',
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

        return response()->json([
            'success' => true,
            'message' => 'Status tugas berhasil diperbarui.',
            'data' => $task
        ], 200);
    }
}
