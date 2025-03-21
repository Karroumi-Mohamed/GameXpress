<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation; 
use  App\Http\Controllers\Api\V1\Admin\PaymentController;
use Illuminate\Routing\Controller;

class NotificationController extends Controller
{
    /**
     * Send an order confirmation email to the client.
     *
     * @param Order $order
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendOrderConfirmation(Order $order)
    {
        try {
            // Send the email
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