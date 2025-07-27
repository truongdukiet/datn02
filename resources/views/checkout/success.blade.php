{{-- resources/views/checkout/success.blade.php --}}
@extends('layouts.app') {{-- Hoặc layout chính của bạn --}}

@section('title', 'Order Placed Successfully!')

@section('content')
<div class="container mt-5 text-center">
    <div class="card shadow p-5">
        <h1 class="text-success mb-4"><i class="bi bi-check-circle-fill me-2"></i> Order Placed Successfully!</h1>
        <p class="lead">Your order **{{ $order->InvoiceCode }}** has been placed and will be processed shortly.</p>
        <p>Total amount: <span class="fw-bold text-danger">{{ number_format($order->Total_amount, 0, ',', '.') }} VND</span></p>
        <p>Payment method: **{{ $order->paymentGateway->Name ?? 'N/A' }}**</p>
        <hr>
        <h4 class="mb-3">Order Details:</h4>
        <ul class="list-group mx-auto" style="max-width: 600px;">
            @foreach ($order->orderDetails as $detail)
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        {{ $detail->productVariant->product->Name ?? 'N/A' }}
                        <small class="text-muted"> (Qty: {{ $detail->Quantity }})</small>
                        <br>
                        <small>
                            @if ($detail->productVariant)
                                @foreach ($detail->productVariant->attributes as $attr)
                                    {{ $attr->attribute->name ?? '' }}: {{ $attr->value ?? '' }}@if (!$loop->last), @endif
                                @endforeach
                            @endif
                        </small>
                    </div>
                    <span>{{ number_format($detail->Subtotal, 0, ',', '.') }} VND</span>
                </li>
            @endforeach
        </ul>
        <hr>
        <p class="mt-4">
            Thank you for your purchase! We will send you an email with the order confirmation.
        </p>
        <a href="{{ url('/') }}" class="btn btn-primary mt-3">Continue Shopping</a>
    </div>
</div>
@endsection
