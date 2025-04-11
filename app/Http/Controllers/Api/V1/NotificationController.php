<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Order;
use Illuminate\Http\Request; // Import Request
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth; // Import Auth

class NotificationController extends Controller
{
    /**
     * Get the authenticated user's unread notifications.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user(); // Or $request->user() if using Sanctum middleware
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        // Fetch only unread notifications, optionally paginate
        $notifications = $user->unreadNotifications()->paginate(10); // Example pagination

        return response()->json($notifications);
    }

    /**
     * Mark a specific notification as read.
     *
     * @param Request $request
     * @param string $notificationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead(Request $request, $notificationId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $notification = $user->unreadNotifications()->find($notificationId);

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read.']);
        }

        return response()->json(['message' => 'Notification not found or already read.'], 404);
    }

     /**
     * Mark all unread notifications as read.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read.']);
    }


    /**
     * Send an order confirmation email to the client. (Keep existing method)
     *
     * @param Order $order
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendOrderConfirmation(Order $order)
    {
        try {
            Mail::to($order->user->email)->send(new OrderConfirmation($order));

            return response()->json([
                'success' => true,
                'message' => 'Order confirmation email sent successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send order confirmation email.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
