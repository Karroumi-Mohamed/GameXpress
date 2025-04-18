<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('status', 'available')
                           ->with('primaryImage', 'category', 'subCategory') 
                           ->paginate(15); 

        return response()->json($products);
    }
    public function show($slug)
    {
        $product = Product::where('slug', $slug)->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }
        if ($product->status !== 'available') {
             return response()->json(['message' => 'Product not found or unavailable.'], 404);
        }

        $product->load('images', 'category', 'subCategory');

        return response()->json($product);
    }
}
