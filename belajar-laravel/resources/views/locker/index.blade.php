@extends('layouts.app')
@section('title', 'Locker Management')
@section('content')
<div class="card">
    <div class="card-header">
        <h3 class="card-title">{{ $title ?? '' }}</h3>
    </div>
    <div class="card-body">
        <div>
            <a href="{{ route('locker.create') }}" class="btn btn-primary">Create New Locker</a>
        </div>
        <table class="table table-bordered table-striped mt-3">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Locker Name</th>
                    <th>Batch</th>
                    <th>Major</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($lockers as $index => $locker)
                <tr>
                    <td>{{ $index += 1 }}</td>
                    <td>{{ $locker->locker_name }}</td>
                    <td>{{ $locker->batch }}</td>
                    <td>{{ $locker->major_name }}</td>
                    <td>
                        @if ($locker->status == 'Available')
                            <span class="badge bg-success">Available</span>
                        @elseif ($locker->status == 'Unavailable')
                            <span class="badge bg-secondary">Unavailable</span>
                        @elseif ($locker->status == 'Damaged')
                            <span class="badge bg-warning text-dark">Damaged</span>
                        @else
                            <span class="badge bg-danger">Missing</span>
                        @endif
                    </td>
                    <td>
                        <a href="{{ route('locker.edit', $locker->id) }}" class="btn btn-primary">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <form action="{{ route('locker.destroy', $locker->id) }}" method="POST" class="d-inline">
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