<?php

use App\Http\Controllers\Api\V1\Admin\CartController as AdminCartController;
use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Admin\ProductImageController as AdminProductImageController;
use App\Http\Controllers\Api\V1\Admin\RolePermissionController as AdminRolePermissionController;
use App\Http\Controllers\Api\V1\ProductController;

use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\OrderController;

use App\Http\Controllers\AuthController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/success', [AdminPaymentController::class, 'success'])->name('payment.success');
Route::get('/cancel', [AdminPaymentController::class, 'cancel'])->name('payment.cancel');

Route::prefix('v1')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        $user->load(['roles', 'permissions']);
        return response()->json($user);
    })->middleware('auth:sanctum');

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{product}', [ProductController::class, 'show']);


    Route::prefix('admin')->group(function () {


        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);

            Route::middleware('role:super_admin')->group(function () {
            });

            Route::middleware('role:product_manager|super_admin')->group(function () {
                Route::apiResource('categories', AdminCategoryController::class);
                Route::put('categories/{category}/subcategories/{subcategory}', [AdminCategoryController::class, 'updateSubcategory']);
                Route::delete('categories/{category}/subcategories/{subcategory}', [AdminCategoryController::class, 'destroySubcategory']);
                Route::get('categories/{category}/subcategories', [AdminCategoryController::class, 'indexSubcategory']);
                Route::get('categories/{category}/subcategories/{subcategory}', [AdminCategoryController::class, 'showSubcategory']);
                Route::apiResource('products', AdminProductController::class)->except(['show', 'index']);
                Route::post('products/{product}/images', [AdminProductImageController::class, 'store']);
                Route::delete('products/{product}/images/{image}', [AdminProductImageController::class, 'destroy']);
                Route::put('products/{product}/images/{image}/set-primary', [AdminProductImageController::class, 'setPrimary']);
                Route::get('products/{product}/images', [AdminProductImageController::class, 'index']);
                Route::get('products/{product}/images/{image}', [AdminProductImageController::class, 'show']);
            });


            Route::middleware('role:user_manager|super_admin')->group(function () {
                Route::apiResource('users', AdminUserController::class);
            });

            Route::middleware('role:super_admin')->group(function () {
                Route::get('/roles', [AdminRolePermissionController::class, 'index']);
                Route::get('/roles/{roleId}', [AdminRolePermissionController::class, 'show']);
                Route::post('/roles/{roleId}/add-permission', [AdminRolePermissionController::class, 'addPermission']);
                Route::post('/roles/{roleId}/remove-permission', [AdminRolePermissionController::class, 'removePermission']);
                Route::post('/roles', [AdminRolePermissionController::class, 'store']);
                Route::put('/roles/{roleId}', [AdminRolePermissionController::class, 'update']);
                Route::delete('/roles/{roleId}', [AdminRolePermissionController::class, 'distroy']);

                Route::get('/permissions', [AdminRolePermissionController::class, 'getPermissions']);
                Route::post('/permissions', [AdminRolePermissionController::class, 'storePermission']);
                Route::put('/permissions/{permissionId}', [AdminRolePermissionController::class, 'updatePermission']);
                Route::delete('/permissions/{permissionId}', [AdminRolePermissionController::class, 'distroyPermission']);
            });

            Route::prefix('notifications')->group(function () {
                Route::get('/', [NotificationController::class, 'index']);
                Route::patch('/{notificationId}/read', [NotificationController::class, 'markAsRead']);
                Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
            });
        });
    });

    Route::prefix('client')->middleware('auth:sanctum')->group(function () {
        Route::prefix('cart')->group(function () {
            Route::get('/', [AdminCartController::class, 'cart']);
            Route::post('items', [AdminCartController::class, 'addItem']);
            Route::put('items/{cartItem}', [AdminCartController::class, 'updateItem']);
            Route::delete('items/{cartItem}', [AdminCartController::class, 'removeItem']);
        });

        Route::get('payments', [AdminPaymentController::class, 'index']);
        Route::get('payments/{payment}', [AdminPaymentController::class, 'show']);
        Route::post('payments', [AdminPaymentController::class, 'charge']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{orderId}', [OrderController::class, 'show']);
        Route::post('/orders/{orderId}/cancel', [OrderController::class, 'cancel']);
    });

    Route::prefix('/cart')->group(function () {
        Route::get('/', [AdminCartController::class, 'cart']);
        Route::post('/items', [AdminCartController::class, 'addItem']);
        Route::put('/items/{cartItem}', [AdminCartController::class, 'updateItem']);
        Route::delete('/items/{cartItem}', [AdminCartController::class, 'removeItem']);
    });
});
