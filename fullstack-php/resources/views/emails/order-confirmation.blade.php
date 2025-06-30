<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .order-details { background-color: #fff; border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
        .shipping-address { background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
        .item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 18px; margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank you for your order, {{ $customerName }}!</h1>
            <p>Your order <strong>#{{ $orderNumber }}</strong> has been received and is being processed.</p>
        </div>

        <div class="shipping-address">
            <h2>Shipping Address</h2>
            <p>
                <strong>{{ $shippingName }}</strong><br>
                {{ $shippingAddress }}<br>
                @if($shippingAddress2)
                    {{ $shippingAddress2 }}<br>
                @endif
                {{ $shippingCity }}, {{ $shippingPostcode }}<br>
                {{ $shippingCountry }}
            </p>
            <p><strong>Email:</strong> {{ $shippingEmail }}</p>
            @if($shippingPhone)
                <p><strong>Phone:</strong> {{ $shippingPhone }}</p>
            @endif
        </div>

        <div class="order-details">
            <h2>Order Summary</h2>
            @foreach ($items as $item)
                <div class="item">
                    <strong>{{ $item['quantity'] }} x {{ $item['name'] }}</strong><br>
                    <span>£{{ number_format($item['price'], 2) }} each</span>
                </div>
            @endforeach
            <div class="total">
                <strong>Total: £{{ number_format($orderTotal, 2) }}</strong>
            </div>
        </div>

        <p>If you have any questions, just reply to this email.</p>
        <p>Best regards,<br>TilloMart Team</p>
    </div>
</body>
</html> 