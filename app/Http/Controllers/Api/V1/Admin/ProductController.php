<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;

/**
 * @OA\Info(
 *    title="Product API",
 *    version="1.0.0",
 *    description="API for managing products"
 * )
 *
 * @OA\Tag(
 *     name="Products",
 *     description="API endpoints for managing products"
 * )
 */
class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view_products')->only(['index', 'show']);
        $this->middleware('permission:create_products')->only('store');
        $this->middleware('permission:edit_products')->only('update');
        $this->middleware('permission:delete_products')->only('destroy');
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/products",
     *     summary="List all products",
     *     description="Returns a paginated list of all products with their categories and images",
     *     operationId="productIndex",
     *     tags={"Products"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="slug", type="string"),
     *                     @OA\Property(property="price", type="number", format="decimal"),
     *                     @OA\Property(property="stock", type="integer"),
     *                     @OA\Property(property="status", type="string"),
     *                     @OA\Property(property="category", type="object"),
     *                     @OA\Property(property="images", type="array", @OA\Items())
     *                 )
     *             ),
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="last_page", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function index()
    {
        $products = Product::with(['category', 'images'])->paginate(10);
        return response()->json($products);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/admin/products",
     *     summary="Create a new product",
     *     description="Creates a new product and returns the product data",
     *     operationId="productStore",
     *     tags={"Products"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "price", "stock", "status"},
     *             @OA\Property(property="name", type="string", example="Gaming Mouse"),
     *             @OA\Property(property="price", type="number", format="float", example=49.99),
     *             @OA\Property(property="stock", type="integer", example=100),
     *             @OA\Property(property="status", type="string", enum={"available", "unavailable"}, example="available"),
     *             @OA\Property(property="category_id", type="integer", example=1, nullable=true),
     *             @OA\Property(property="sub_category_id", type="integer", example=null, nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Product created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Product created successfully"),
     *             @OA\Property(property="product", type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="slug", type="string"),
     *                 @OA\Property(property="price", type="number"),
     *                 @OA\Property(property="stock", type="integer"),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time"),
     *                 @OA\Property(property="images", type="array", @OA\Items())
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['name']);

        if (isset($validated['category_id'])) {
            $validated['sub_category_id'] = null;
        } elseif (isset($validated['sub_category_id'])) {
            $validated['category_id'] = null;
        }

        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('productsImages', 'public');

                $product->images()->create([
                    'image_url' => $path,
                    'is_primary' => $index === 0
                ]);
            }
        }

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('images')
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/products/{product}",
     *     summary="Get product details",
     *     description="Returns details of a specific product",
     *     operationId="productShow",
     *     tags={"Products"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="product",
     *         in="path",
     *         description="Product ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="slug", type="string"),
     *             @OA\Property(property="price", type="number"),
     *             @OA\Property(property="stock", type="integer"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="category", type="object"),
     *             @OA\Property(property="images", type="array", @OA\Items())
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found"
     *     )
     * )
     */
    public function show($slug)
    {
        $product = Product::where('slug', $slug)->with(['category', 'images'])->firstOrFail();
        return response()->json($product->load(['category', 'images']));
    }

    /**
     * @OA\Put(
     *     path="/api/v1/admin/products/{product}",
     *     summary="Update a product",
     *     description="Updates an existing product",
     *     operationId="productUpdate",
     *     tags={"Products"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="product",
     *         in="path",
     *         description="Product ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="price", type="number", format="float"),
     *             @OA\Property(property="stock", type="integer"),
     *             @OA\Property(property="status", type="string", enum={"available", "unavailable"}),
     *             @OA\Property(property="category_id", type="integer", nullable=true),
     *             @OA\Property(property="sub_category_id", type="integer", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="slug", type="string"),
     *             @OA\Property(property="price", type="number"),
     *             @OA\Property(property="stock", type="integer"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="category", type="object"),
     *             @OA\Property(property="images", type="array", @OA\Items())
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found"
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="Product slug already exists"
     *     )
     * )
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['name']);

        if (Product::where('slug', $validated['slug'])->where('id', '!=', $product->id)->exists()) {
            return response()->json(['message' => 'Product already exists.'], 409);
        }

        if (isset($validated['category_id'])) {
            $validated['sub_category_id'] = null;
        } elseif (isset($validated['sub_category_id'])) {
            $validated['category_id'] = null;
        }

        $product->update($validated);

        return response()->json($product->load(['category', 'images']));
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/admin/products/{product}",
     *     summary="Delete a product",
     *     description="Deletes a product and its associated images",
     *     operationId="productDestroy",
     *     tags={"Products"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="product",
     *         in="path",
     *         description="Product ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Product deleted successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found"
     *     )
     * )
     */
    public function destroy(Product $product)
    {
        $product->images()->delete();
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully.'], 200);
    }
}
