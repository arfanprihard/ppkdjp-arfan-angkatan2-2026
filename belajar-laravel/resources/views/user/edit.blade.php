@extends('layouts.app')
@section('title', 'Create New User')
@section('content')
<div class="card">
    <div class="card-header">
        <h3 class="card-title">
            {{ $title ?? '' }}
        </h3>
    </div>
    <form action="{{ route('user.update', $edit->id) }}" method="post" class="px-5 pb-4">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label for="">Name *</label>
            <input type="text" class="form-control" placeholder="Enter your name" name="name" required
                value="{{ $edit->name }}">
        </div>
        <div class="mb-3">
            <label for="">Email *</label>
            <input type="email" class="form-control" placeholder="Enter your email" name="email" required
                value="{{ $edit->email }}">
        </div>
        <div class="mb-3">
            <label for="">Password</label>
            <input type="password" class="form-control" placeholder="Enter your password" name="password">
        </div>
        <div class="mb-3">
            <label for="">Confirm Password</label>
            <input type="password" class="form-control" placeholder="Enter your confirm password" name="password">
        </div>
        <button class="btn btn-primary" type="submit">Save</button>
        <a href="{{ route('user.index') }}" class="btn btn-light">Back</a>
    </form>
</div>
@endsection