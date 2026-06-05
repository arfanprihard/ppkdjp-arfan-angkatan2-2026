@extends('layouts.app')
@section('title', 'Create New Role')
@section('content')
<div class="card">
    <div class="card-header">
        <h3 class="card-title">
            {{ $title ?? '' }}
        </h3>
    </div>
    <form action="{{ route('role.update', $edit->id) }}" method="post" class="px-5 pb-4">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label for="">Name *</label>
            <input type="text" class="form-control" placeholder="Enter your name" name="name" required>
        </div>
        <div class="mb-3">
            <label>Status *</label>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="is_active" value="1" required>
                <label class="form-check-label">Active</label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="is_active" value="0">
                <label class="form-check-label">Inactive</label>
            </div>
        </div>
        <button class="btn btn-primary" type="submit">Save</button>
        <a href="{{ route('role.index') }}" class="btn btn-light">Back</a>
    </form>
</div>
@endsection