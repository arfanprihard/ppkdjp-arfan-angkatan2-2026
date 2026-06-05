@extends('layouts.app')
@section('title', 'User Management')
@section('content')
<div class="card">
    <div class="card-header">
        <h3 class="card-title">{{ $title ?? '' }}</h3>
    </div>
    <div class="card-body">
        <div>
            <a href="{{ route('user.create') }}" class="btn btn-primary">Create New User</a>
        </div>
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $index => $user)
                <tr>
                    <td>{{ $index += 1 }}</td>
                    <td>{{ $user->name ?? '' }}</td>
                    <td>{{ $user->email }}</td>
                    <td>
                        <a href="{{ route('user.edit', $user->id) }}" class="btn btn-primary">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <form action="{{ route('user.destroy', $user->id) }}" method="POST" class="d-inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger" data-confirm-delete="true">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                        </form>

                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection