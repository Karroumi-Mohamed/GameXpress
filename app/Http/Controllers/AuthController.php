<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
            $user->assignRole('super_admin');
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
        $guestCart = Cart::where('session_id', $request->session()->getId())->first();
        if (!Auth::attempt($request->only('email', 'password'))) {
            response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        if ($guestCart) {
            Log::info('Guest Cart: ', ['cart' => $guestCart]);
            $userCart = Cart::where('user_id', Auth::id())->first();
            if ($userCart) {
                Log::info('User Cart: ', ['cart' => $userCart]);
                $guestCartItems = $guestCart->items;
                foreach ($guestCartItems as $item) {
                    $itemQuantity = $item->quantity;
                    $itemExists = $userCart->items()->where('product_id', $item->product_id)->first();
                    if ($itemExists) {
                        $newQuantity = $itemExists->quantity + $itemQuantity;
                        if ($newQuantity > $itemExists->product->stock) {
                            Log::info('Insufficient stock for product ID: ' . $item->product_id . ' giving available stock: ' . $itemExists->product->stock);
                            $itemExists->update(['quantity' => $itemExists->product->stock]);
                        } else {
                            $itemExists->update(['quantity' => $newQuantity]);
                        }
                        $item->delete();
                    } else {
                        $item->update(['cart_id' => $userCart->id]);
                    }
                }
                $guestCart->delete();
            }
        }

        $request->session()->regenerate();
        $user = Auth::user();

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load('roles'),
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
