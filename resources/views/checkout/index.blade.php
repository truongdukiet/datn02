{{-- resources/views/checkout/index.blade.php --}}
@extends('layouts.app') {{-- Hoặc layout chính của bạn --}}

@section('title', 'Checkout')

@section('content')
<div class="container mt-5">
    <h1 class="mb-4">Checkout</h1>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="row">
        <div class="col-md-8">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Shipping Information</h6>
                </div>
                <div class="card-body">
                    <form action="{{ route('checkout.placeOrder') }}" method="POST">
                        @csrf
                        <div class="mb-3">
                            <label for="receiver_name" class="form-label">Receiver Name</label>
                            <input type="text" class="form-control" id="receiver_name" name="receiver_name" value="{{ old('receiver_name', Auth::user()->Fullname ?? '') }}" required>
                        </div>
                        <div class="mb-3">
                            <label for="receiver_phone" class="form-label">Phone Number</label>
                            <input type="text" class="form-control" id="receiver_phone" name="receiver_phone" value="{{ old('receiver_phone', Auth::user()->Phone ?? '') }}" required>
                        </div>
                        <div class="mb-3">
                            <label for="shipping_address" class="form-label">Shipping Address</label>
                            <textarea class="form-control" id="shipping_address" name="shipping_address" rows="3" required>{{ old('shipping_address', Auth::user()->Address ?? '') }}</textarea>
                        </div>

                        <h5 class="mt-4">Payment Method</h5>
                        <div class="mb-3">
                            @foreach ($paymentGateways as $payment)
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="payment_id" id="payment{{ $payment->PaymentID }}" value="{{ $payment->PaymentID }}" {{ $loop->first ? 'checked' : '' }} required>
                                    <label class="form-check-label" for="payment{{ $payment->PaymentID }}">
                                        {{ $payment->Name }}
                                    </label>
                                </div>
                            @endforeach
                        </div>

                        <h5 class="mt-4">Voucher (Optional)</h5>
                        <div class="mb-3">
                            <label for="voucher_code" class="form-label">Voucher Code</label>
                            <input type="text" class="form-control" id="voucher_code" name="voucher_code" value="{{ old('voucher_code') }}">
                        </div>

                        <button type="submit" class="btn btn-primary btn-lg w-100">Place Order</button>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Order Summary</h6>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush mb-3">
                        @foreach ($cartItems as $item)
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    {{ $item->productVariant->product->Name ?? 'N/A' }}
                                    <small class="text-muted"> (Qty: {{ $item->Quantity }})</small>
                                    <br>
                                    <small>
                                        @if ($item->productVariant)
                                            @foreach ($item->productVariant->attributes as $attr)
                                                {{ $attr->attribute->name ?? '' }}: {{ $attr->value ?? '' }}@if (!$loop->last), @endif
                                            @endforeach
                                        @endif
                                    </small>
                                </div>
                                <span>{{ number_format($item->Quantity * ($item->productVariant->Price ?? 0), 0, ',', '.') }} VND</span>
                            </li>
                        @endforeach
                    </ul>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center fw-bold">
                        <span>Total:</span>
                        <span>{{ number_format($totalAmount, 0, ',', '.') }} VND</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
