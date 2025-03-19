<?php

use App\Models\Cart;
use Illuminate\Support\Facades\Auth;

function CalculateTotalPrice()
{
    $items = Auth::user()->cart()->items();
    dd($items);
    $items->each(function ($item) {

        $quantity = $item->quantity;
        $price = $item->product()->price;
        $TotalPrice = $quantity * $price;
        return $TotalPrice;
    });
}
