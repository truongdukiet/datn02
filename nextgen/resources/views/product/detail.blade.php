{{-- resources/views/product/detail.blade.php --}}
@extends('layouts.app') {{-- Hoặc layout chính của bạn --}}

@section('title', $product->Name)

@section('content')
<div class="container mt-5">
    <div class="row">
        <div class="col-md-6">
            <img src="{{ asset('storage/' . $product->Image) }}" class="img-fluid rounded" alt="{{ $product->Name }}">
        </div>
        <div class="col-md-6">
            <h1 class="mb-3">{{ $product->Name }}</h1>
            <p class="text-muted">{{ $product->category->Name ?? 'Uncategorized' }}</p>
            <p class="lead fw-bold text-danger">{{ number_format($product->base_price, 0, ',', '.') }} VND</p>
            <hr>
            <h4>Description</h4>
            <p>{{ $product->Description }}</p>

            @if ($product->variants->isNotEmpty())
                <h5 class="mt-4">Available Variants:</h5>
                <form action="{{ route('cart.add') }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label for="variantSelect" class="form-label">Select Variant:</label>
                        <select class="form-select" id="variantSelect" name="product_variant_id" required>
                            @foreach ($product->variants as $variant)
                                <option value="{{ $variant->ProductVariantID }}" data-price="{{ $variant->Price }}">
                                    @foreach ($variant->attributes as $attr)
                                        {{ $attr->attribute->name }}: {{ $attr->value }}@if (!$loop->last), @endif
                                    @endforeach
                                    - {{ number_format($variant->Price, 0, ',', '.') }} VND (Stock: {{ $variant->Stock }})
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Quantity:</label>
                        <input type="number" class="form-control" id="quantity" name="quantity" value="1" min="1" max="{{ $product->variants->first()->Stock }}" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg">Add to Cart</button>
                </form>
            @else
                <p class="text-warning">No variants available for this product.</p>
            @endif

            <h4 class="mt-5">Product Reviews</h4>
            {{-- Thêm logic hiển thị reviews ở đây --}}
            <p>No reviews yet.</p> {{-- Placeholder --}}
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    // JavaScript để cập nhật số lượng tối đa dựa trên stock của biến thể được chọn
    document.addEventListener('DOMContentLoaded', function() {
        const variantSelect = document.getElementById('variantSelect');
        const quantityInput = document.getElementById('quantity');

        if (variantSelect && quantityInput) {
            variantSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const stock = selectedOption.textContent.match(/\(Stock: (\d+)\)/); // Trích xuất số lượng từ text
                if (stock && stock[1]) {
                    quantityInput.max = parseInt(stock[1]);
                    if (parseInt(quantityInput.value) > parseInt(stock[1])) {
                        quantityInput.value = stock[1];
                    }
                }
            });
            // Kích hoạt lần đầu để thiết lập max
            variantSelect.dispatchEvent(new Event('change'));
        }
    });
</script>
@endpush
