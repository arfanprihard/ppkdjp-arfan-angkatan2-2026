<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => 'Validation failed.', 'errors' => $validator->errors()], 422);
            }
            $user = User::where('email', $request->email)->first();
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['success' => false, 'message' => 'Invalid email or password.'], 401);
            }
            $user->tokens()->delete();
            $token = $user->createToken('API Token')->plainTextToken;
            return response()->json(['success' => true, 'message' => 'Login successful.', 'token' => $token, 'data' => $user], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'An error occurred during login.', 'error' => $th->getMessage()], 500);
        }
    }
    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();
            return response()->json(['success' => true, 'message' => 'Logout successful.'], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'An error occurred during logout.', 'error' => $th->getMessage()], 500);
        }
    }
}
