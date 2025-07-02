{{-- resources/views/cart/index.blade.php --}}
@extends('layouts.app') {{-- Hoặc layout chính của bạn --}}

@section('title', 'Your Shopping Cart')

@section('content')
<div class="container mt-5">
    <h1 class="mb-4">Your Shopping Cart</h1>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    @if ($cartItems->isEmpty())
        <div class="alert alert-info">Your cart is empty. <a href="{{ url('/') }}">Continue shopping</a></div>
    @else
        <div class="row">
            <div class="col-md-9">
                @php $subtotal = 0; @endphp
                @foreach ($cartItems as $item)
                    @php
                        $variantPrice = $item->productVariant->Price ?? 0;
                        $itemSubtotal = $item->Quantity * $variantPrice;
                        $subtotal += $itemSubtotal;
                    @endphp
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-2">
                                    <img src="{{ asset('storage/' . ($item->productVariant->product->Image ?? 'placeholder.jpg')) }}" class="img-fluid rounded" alt="Product Image">
                                </div>
                                <div class="col-md-5">
                                    <h5 class="card-title">{{ $item->productVariant->product->Name ?? 'N/A' }}</h5>
                                    <p class="text-muted">
                                        @if ($item->productVariant)
                                            @foreach ($item->productVariant->attributes as $attr)
                                                {{ $attr->attribute->name ?? '' }}: {{ $attr->value ?? '' }}@if (!$loop->last), @endif
                                            @endforeach
                                        @endif
                                    </p>
                                    <p>Price: {{ number_format($variantPrice, 0, ',', '.') }} VND</p>
                                </div>
                                <div class="col-md-2">
                                    <form action="{{ route('cart.update') }}" method="POST">
                                        @csrf
                                        @method('PUT')
                                        <input type="hidden" name="cart_id" value="{{ $item->CartID }}">
                                        <div class="input-group">
                                            <input type="number" name="quantity" value="{{ $item->Quantity }}" min="1" class="form-control text-center">
                                            <button type="submit" class="btn btn-sm btn-outline-primary">Update</button>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-md-2 text-end">
                                    <p class="fw-bold">{{ number_format($itemSubtotal, 0, ',', '.') }} VND</p>
                                </div>
                                <div class="col-md-1 text-end">
                                    <form action="{{ route('cart.remove', $item->CartID) }}" method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-danger">X</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            <div class="col-md-3">
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title">Cart Summary</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Subtotal:
                                <span class="fw-bold">{{ number_format($subtotal, 0, ',', '.') }} VND</span>
                            </li>
                            <li class="list-group-item d-grid gap-2">
                                <a href="{{ route('checkout.index') }}" class="btn btn-success btn-lg">Proceed to Checkout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>
@endsection
