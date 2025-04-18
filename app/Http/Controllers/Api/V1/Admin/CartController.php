<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use App\Helpers\CartHelper;
use App\Helpers\ProductHelper;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function addItem(Request $request)
    {

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);


        $product = Product::findOrFail($validated['product_id']);

        if (!ProductHelper::hasEnoughStock($product, $validated['quantity'])) {
            return response()->json([
                'message' => 'Insufficient stock'
            ], 400);
        }


        $cart = $this->getCart(Session::getId());

        $cartItem = $this->addToCart($cart, $product, $validated['quantity']);

        $totals = CartHelper::calculateTotal($cart);

        return response()->json([
            'message' => 'Item added to cart',
            'cart_item' => $cartItem,
            'cart' => $cart,
            'totals' => $totals
        ], 201);
    }

    public function updateItem(Request $request, CartItem $cartItem)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if (!ProductHelper::hasEnoughStock($cartItem->product, $validated['quantity'])) {
            return response()->json([
                'message' => 'Insufficient stock'
            ], 400);
        }

        // Directly update the quantity of the specific cart item
        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        // Recalculate totals for the cart
        $cart = $cartItem->cart; // Get the cart associated with the item
        $totals = CartHelper::calculateTotal($cart);

        return response()->json([
            'message' => 'Cart item updated',
            'cart_item' => $cartItem->load('product'), // Return the updated item with product
            'totals' => $totals
        ]);
    }

    private function updateCartItem($item, $quantity)
    {
        $item->quantity = $quantity;
        $item->save();

        $cart = $item->cart;
        $totals = CartHelper::calculateTotal($cart);

        return [
            'updated_item' => $item->fresh(),
            'totals' => $totals
        ];
    }

    private function addToCart($cart, $product, $quantity)
    {
        $existingItem = $cart->items()->where('product_id', $product->id)->first();
        $newQuantity = $existingItem ? $existingItem->quantity + $quantity : $quantity;
        $cartItem = CartItem::updateOrCreate(
            [
                'cart_id' => $cart->id,
                'product_id' => $product->id
            ],
            ['quantity' => $newQuantity]
        );

        $cart = $cart->fresh();
        $totals = CartHelper::calculateTotal($cart);


        return [
            'cart_item' => $cartItem->load('product'),
            'totals' => $totals
        ];
    }

    public function removeItem(CartItem $cartItem)
    {
        $cartItemId = $cartItem->id;

        $cartItem->delete();
        $cart = $cartItem->cart;
        $totals = CartHelper::calculateTotal($cart);

        return response()->json([
            'message' => 'Item removed from cart',
            'totals' => $totals
        ]);
    }

    public function cart(Request $request)
    {
        $cart = $this->getCart(Session::getId());

        $totals = CartHelper::calculateTotal($cart);
        $cart->load('items.product');


        return response()->json([
            'cart' => $cart,
            'items' => $cart->items,
            'totals' => $totals
        ]);
    }

    private function getCart($sessionId): Cart
    {
        if (Auth::check()) {
            return Cart::with('items.product')->firstOrCreate([
                'user_id' => Auth::id()
            ]);
        }

        return Cart::with('items.product')->firstOrCreate([
            'session_id' => $sessionId
        ]);
    }
}
