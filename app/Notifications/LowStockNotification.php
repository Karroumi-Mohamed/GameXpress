<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification
{
    use Queueable;

    public $product;
    /**
     * Create a new notification instance.
     */
    public function __construct($product)
    {
        $this->product = $product;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Low Stock Alert for ' . $this->product->name)
            ->line('The stock for ' . $this->product->name . ' is running low.')
            ->action('Check Inventory', url('/inventory'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        // Data to be stored in the 'data' column of the notifications table
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'current_stock' => $this->product->stock,
            'message' => "Stock for {$this->product->name} is running low ({$this->product->stock} units left).",
            // Optional: Add a link relevant to the admin context
            'link' => '/admin/products/' . $this->product->id . '/edit',
        ];
    }
}
