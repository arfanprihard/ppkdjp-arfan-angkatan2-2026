<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use RealRashid\SweetAlert\Facades\Alert;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $title = 'Delete Role!';
        $text = "Are you sure you want to delete?";
        confirmDelete($title, $text);

        $roles = Role::orderByDesc('id')->get();
        $title = 'Role Management';
        return view('role.index', compact('roles', 'title'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $title = 'Create New Role';
        return view('role.create', compact('title'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
        ]);

        Role::create([
            'name'     => $request->name,
        ]);
        Alert::success('Berhasil', 'Role berhasil ditambahkan!');

        return redirect()->route('role.index');
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
        $title = 'Edit Role';
        $edit = Role::find($id);
        // $edit = Role::findOrFail($id);
        return view('role.edit', compact('title', 'edit'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email
        ];
        if (filled($request->password)) {
            $data['password'] = $request->password;
        }
        Role::find($id)->update($data);
        return redirect()->to('role');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Role::find($id)->delete();
        Alert::success('Berhasil', 'Role berhasil dihapus');
        return redirect()->to('role');
    }
}
