<?php

namespace App\Http\Controllers;

use App\Models\FnbItem;
use Illuminate\Http\Request;

class FnbItemController extends Controller
{
    /**
     * Menampilkan semua item menu F&B.
     */
    public function index()
    {
        $items = FnbItem::orderBy('category')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ], 200);
    }

    /**
     * Menambahkan item menu baru. (Admin Only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:food,beverage,dessert,snack',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $item = FnbItem::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Item menu berhasil ditambahkan.',
            'data' => $item
        ], 201);
    }

    /**
     * Menampilkan detail satu item menu.
     */
    public function show(int $id)
    {
        $item = FnbItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item menu tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $item
        ], 200);
    }

    /**
     * Mengupdate item menu. (Admin Only)
     */
    public function update(Request $request, int $id)
    {
        $item = FnbItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item menu tidak ditemukan.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|in:food,beverage,dessert,snack',
            'price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $item->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Item menu berhasil diperbarui.',
            'data' => $item
        ], 200);
    }

    /**
     * Menghapus item menu. (Admin Only)
     */
    public function destroy(int $id)
    {
        $item = FnbItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item menu tidak ditemukan.'
            ], 404);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item menu berhasil dihapus.'
        ], 200);
    }
}
