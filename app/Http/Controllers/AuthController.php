<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth; // Import Auth facade
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException; // Import ValidationException
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed'
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password'])
        ]);

        if (User::count() === 1) {
            $user->assignRole('super_admin');
        } else {
            $user->assignRole('product_manager');
        }

        $token = $user->createToken($request->name);
        return response()->json([
            'user' => $user->load('roles'),
            'token' => $token->plainTextToken
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        if (!$user->hasAnyRole(['super_admin', 'product_manager', 'user_manager'])) {
             Auth::logout();
             $request->session()->invalidate();
             $request->session()->regenerateToken();
             return response()->json([
                 'message' => 'Unauthorized access based on role.'
             ], 403);
        }


        $request->session()->regenerate();

        return response()->json([
             'message' => 'Login successful',
             'user' => $user->load('roles')
        ], 200);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
