<?php

namespace App\Http\Controllers;

use App\Models\Locker;
use Illuminate\Http\Request;
use RealRashid\SweetAlert\Facades\Alert;

class LockerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $title = 'Delete Locker!';
        $text = 'Are you sure you want to delete?';
        confirmDelete($title, $text);

        $lockers = Locker::orderByDesc('id')->get();
        $title = 'Locker Management';

        return view('locker.index', compact('lockers', 'title'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $title = 'Create New Locker';

        return view('locker.create', compact('title'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'locker_name' => 'required|string|max:15|unique:lockers,locker_name',
            'batch' => 'required|in:1,2,3,4',
            'major_name' => 'required|in:Web Programming,Content Creator,Teknisi Jaringan',
            'status' => 'required|in:Available,Unavailable,Damaged,Missing',
        ]);

        Locker::create($request->only('locker_name', 'batch', 'major_name', 'status'));

        Alert::success('Berhasil', 'Locker berhasil ditambahkan!');

        return redirect()->route('locker.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $title = 'Edit Locker';
        $edit = Locker::findOrFail($id);

        return view('locker.edit', compact('title', 'edit'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'locker_name' => 'required|string|max:15|unique:lockers,locker_name,'.$id,
            'batch' => 'required|in:1,2,3,4',
            'major_name' => 'required|in:Web Programming,Content Creator,Teknisi Jaringan',
            'status' => 'required|in:Available,Unavailable,Damaged,Missing',
        ]);

        Locker::findOrFail($id)->update($request->only('locker_name', 'batch', 'major_name', 'status'));

        Alert::success('Berhasil', 'Locker berhasil diedit!');

        return redirect()->route('locker.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Locker::findOrFail($id)->delete();

        Alert::success('Berhasil', 'Locker berhasil dihapus!');

        return redirect()->route('locker.index');
    }
}
