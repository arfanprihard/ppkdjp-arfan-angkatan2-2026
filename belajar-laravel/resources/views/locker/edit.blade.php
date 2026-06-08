@extends('layouts.app')
@section('title', 'Edit Locker')
@section('content')
<div class="card">
    <div class="card-header">
        <h3 class="card-title">{{ $title ?? '' }}</h3>
    </div>
    <form action="{{ route('locker.update', $edit->id) }}" method="POST" class="px-5 pb-4">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label>Locker Name *</label>
            <input type="text" class="form-control @error('locker_name') is-invalid @enderror"
                placeholder="Contoh: L-001" name="locker_name" value="{{ old('locker_name', $edit->locker_name) }}" required>
            @error('locker_name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        <div class="mb-3">
            <label>Batch *</label>
            <select name="batch" class="form-select @error('batch') is-invalid @enderror" required>
                <option value="">-- Pilih Batch --</option>
                @foreach (['1', '2', '3', '4'] as $batch)
                    <option value="{{ $batch }}" {{ old('batch', $edit->batch) == $batch ? 'selected' : '' }}>
                        {{ $batch }}
                    </option>
                @endforeach
            </select>
            @error('batch')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        <div class="mb-3">
            <label>Major *</label>
            <select name="major_name" class="form-select @error('major_name') is-invalid @enderror" required>
                <option value="">-- Pilih Jurusan --</option>
                @foreach (['Web Programming', 'Content Creator', 'Teknisi Jaringan'] as $major)
                    <option value="{{ $major }}" {{ old('major_name', $edit->major_name) == $major ? 'selected' : '' }}>
                        {{ $major }}
                    </option>
                @endforeach
            </select>
            @error('major_name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        <div class="mb-3">
            <label>Status *</label>
            <select name="status" class="form-select @error('status') is-invalid @enderror" required>
                <option value="">-- Pilih Status --</option>
                @foreach (['Available', 'Unavailable', 'Damaged', 'Missing'] as $status)
                    <option value="{{ $status }}" {{ old('status', $edit->status) == $status ? 'selected' : '' }}>
                        {{ $status }}
                    </option>
                @endforeach
            </select>
            @error('status')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        <button class="btn btn-primary" type="submit">Update</button>
        <a href="{{ route('locker.index') }}" class="btn btn-light">Back</a>
    </form>
</div>
@endsection
