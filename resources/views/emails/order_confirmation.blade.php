<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body>
    <h1>Order Confirmation</h1>
    <p>Thank you for your order! Here are the details:</p>

    <h2>Order #{{ $order->id }}</h2>
    <p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>
    <p><strong>Total Price:</strong> ${{ number_format($order->total_price, 2) }}</p>

    <h3>Order Items:</h3>
    <ul>
        @foreach ($order->items as $item)
            <li>
                {{ $item->product->name }} - 
                {{ $item->quantity }} x ${{ number_format($item->price, 2) }}
            </li>
        @endforeach
    </ul>

    <p>If you have any questions, please contact us.</p>
    <p>Thank you for shopping with us!</p>
</body>
</html>