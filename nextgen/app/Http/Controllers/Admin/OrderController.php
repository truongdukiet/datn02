<?php
// app/Http/Controllers/Admin/OrderController.php
// Đây là tệp điều khiển (Controller) chính cho việc quản lý đơn hàng trong khu vực Admin.

namespace App\Http\Controllers\Admin; // Định nghĩa namespace cho Controller.

use App\Http\Controllers\Controller; // Import Controller cơ sở của Laravel.
use App\Models\Order; // Import model Order để tương tác với bảng 'orders'.
use App\Models\OrderItem; // Import model OrderItem để tương tác với bảng 'order_items'.
use App\Models\ProductVariant; // Import model ProductVariant để lấy thông tin sản phẩm.
use Illuminate\Http\Request; // Import class Request để lấy dữ liệu từ các yêu cầu HTTP.
use Illuminate\Support\Facades\Validator; // Import Validator để xác thực dữ liệu đầu vào.
use Illuminate\Validation\Rule; // Import Rule để sử dụng các quy tắc xác thực nâng cao.
use Illuminate\Support\Facades\DB; // Import DB facade để sử dụng transaction.
use App\Models\Review; // Import model Order để tương tác với bảng 'orders'.


class OrderController extends Controller // Định nghĩa class Controller của chúng ta.
{
    /**
     * Lấy tất cả đơn hàng.
     * Xử lý yêu cầu GET đến /api/admin/orders
     *
     * @return \Illuminate\Http\JsonResponse Trả về danh sách đơn hàng dưới dạng JSON.
     */
    public function index() // Phương thức này xử lý việc lấy tất cả đơn hàng.
    {
        // Lấy tất cả đơn hàng từ cơ sở dữ liệu, kèm theo thông tin chi tiết các mặt hàng trong đơn hàng,
        // người dùng, voucher và phương thức thanh toán.
        // Sử dụng các tên mối quan hệ từ Model Order của bạn: 'user', 'voucher', 'paymentGateway', 'orderDetails'
        $orders = Order::with(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product'])
                       ->orderBy('Pending_at', 'desc') // Sắp xếp theo cột 'Pending_at'
                       ->get();
        // Trả về danh sách đơn hàng dưới dạng phản hồi JSON.
        return response()->json($orders);
    }

    /**
     * Lưu trữ một đơn hàng mới.
     * Xử lý yêu cầu POST đến /api/admin/orders
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client.
     * @return \Illuminate\Http\JsonResponse Trả về JSON với thông báo thành công và dữ liệu đơn hàng mới.
     */
    public function store(Request $request) // Phương thức này xử lý việc thêm đơn hàng mới.
    {
        // Định nghĩa các quy tắc xác thực cho dữ liệu đầu vào, sử dụng tên cột từ Model Order.
        $validator = Validator::make($request->all(), [
            'UserID' => 'required|integer|exists:users,UserID', // ID người dùng, phải tồn tại.
            'Receiver_name' => 'required|string|max:255',
            'Receiver_phone' => 'required|string|max:20',
            'Shipping_address' => 'required|string|max:500',
            'VoucherID' => 'nullable|integer|exists:vouchers,VoucherID', // ID voucher, có thể rỗng, phải tồn tại.
            'PaymentID' => 'required|integer|exists:payment_gateways,PaymentID', // ID thanh toán, phải tồn tại.
            'products' => 'required|array|min:1', // Danh sách sản phẩm trong đơn hàng.
            'products.*.product_variant_id' => 'required|integer|exists:productvariants,id', // ID biến thể sản phẩm, phải tồn tại.
            'products.*.quantity' => 'required|integer|min:1', // Số lượng sản phẩm, tối thiểu 1.
        ], [
            // Thông báo lỗi tùy chỉnh.
            'UserID.required' => 'ID người dùng là bắt buộc.',
            'UserID.exists' => 'Người dùng không tồn tại.',
            'Receiver_name.required' => 'Tên người nhận là bắt buộc.',
            'Receiver_phone.required' => 'Số điện thoại người nhận là bắt buộc.',
            'Shipping_address.required' => 'Địa chỉ giao hàng là bắt buộc.',
            'VoucherID.exists' => 'Voucher không tồn tại.',
            'PaymentID.required' => 'ID phương thức thanh toán là bắt buộc.',
            'PaymentID.exists' => 'Phương thức thanh toán không tồn tại.',
            'products.required' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'products.array' => 'Danh sách sản phẩm phải là một mảng.',
            'products.min' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'products.*.product_variant_id.required' => 'ID biến thể sản phẩm là bắt buộc cho mỗi mặt hàng.',
            'products.*.product_variant_id.exists' => 'Biến thể sản phẩm không tồn tại.',
            'products.*.quantity.required' => 'Số lượng là bắt buộc cho mỗi mặt hàng.',
            'products.*.quantity.integer' => 'Số lượng phải là số nguyên.',
            'products.*.quantity.min' => 'Số lượng phải lớn hơn hoặc bằng 1.',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422); // Trả về lỗi xác thực.
        }

        DB::beginTransaction(); // Bắt đầu một transaction để đảm bảo tính toàn vẹn dữ liệu.
        try {
            $totalAmount = 0;
            $orderItemsData = [];

            // Duyệt qua các sản phẩm để tính tổng tiền và chuẩn bị chi tiết đơn hàng
            foreach ($request->products as $item) {
                $variant = ProductVariant::find($item['product_variant_id']);
                if (!$variant) {
                    // Nếu biến thể không tồn tại, có thể rollback hoặc bỏ qua tùy logic
                    throw new \Exception("Biến thể sản phẩm với ID {$item['product_variant_id']} không tồn tại.");
                }

                $unitPrice = $variant->price; // Giả sử ProductVariant có cột 'price'
                $subtotal = $unitPrice * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItemsData[] = [
                    'product_id' => $variant->product_id, // Lấy ProductID từ ProductVariant
                    'product_variant_id' => $variant->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];
            }

            // Tạo đơn hàng chính, sử dụng tên cột từ Model Order.
            $order = Order::create([
                'UserID' => $request->UserID,
                'VoucherID' => $request->VoucherID,
                'PaymentID' => $request->PaymentID,
                'Receiver_name' => $request->Receiver_name,
                'Receiver_phone' => $request->Receiver_phone,
                'Shipping_address' => $request->Shipping_address,
                'Total_amount' => $totalAmount, // Tổng tiền đã tính
                'Status' => 'pending', // Trạng thái mặc định khi tạo đơn hàng
                'Create_at' => now(), // Đặt thời gian tạo thủ công nếu không dùng timestamps mặc định
                'Update_at' => now(), // Đặt thời gian cập nhật thủ công
            ]);

            // Tạo các chi tiết đơn hàng, sử dụng 'orderid' làm khóa ngoại nếu OrderDetail Model của bạn dùng 'orderid'
            foreach ($orderItemsData as $itemData) {
                $order->orderDetails()->create($itemData); // Sử dụng mối quan hệ orderDetails
            }

            DB::commit(); // Commit transaction nếu mọi thứ thành công.

            // Load lại order cùng các mối quan hệ để trả về cho frontend
            // Sử dụng các tên mối quan hệ từ Model Order của bạn: 'user', 'voucher', 'paymentGateway', 'orderDetails'
            $order->load(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product']);

            // Trả về phản hồi JSON thông báo thành công.
            return response()->json(['message' => 'Đơn hàng đã được tạo thành công.', 'order' => $order], 201);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction nếu có lỗi xảy ra.
            return response()->json(['message' => 'Có lỗi xảy ra khi tạo đơn hàng: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Hiển thị một đơn hàng cụ thể.
     * Xử lý yêu cầu GET đến /api/admin/orders/{id}
     *
     * @param  int  $id ID của đơn hàng cần hiển thị.
     * @return \Illuminate\Http\JsonResponse Trả về dữ liệu đơn hàng cụ thể.
     */
    public function show($id) // Phương thức này xử lý việc lấy một đơn hàng theo ID.
    {
        // Sử dụng OrderID làm khóa chính
        $order = Order::with(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product'])->find($id); // Tìm đơn hàng trong cơ sở dữ liệu bằng ID, kèm theo các mối quan hệ.

        if (!$order) { // Nếu không tìm thấy đơn hàng.
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404); // Trả về lỗi 404.
        }

        return response()->json($order); // Trả về dữ liệu đơn hàng dưới dạng JSON.
    }

    /**
     * Cập nhật một đơn hàng hiện có.
     * Xử lý yêu cầu PUT/PATCH đến /api/admin/orders/{id}
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client.
     * @param  int  $id ID của đơn hàng cần cập nhật.
     * @return \Illuminate\Http\JsonResponse Trả về thông báo thành công và dữ liệu đơn hàng đã cập nhật.
     */
    public function update(Request $request, $id) // Phương thức này xử lý việc cập nhật đơn hàng.
    {
        // Sử dụng OrderID làm khóa chính
        $order = Order::find($id); // Tìm đơn hàng cần cập nhật bằng ID.

        if (!$order) { // Nếu không tìm thấy đơn hàng.
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        }

        // Xác thực dữ liệu đầu vào, sử dụng tên cột từ Model Order.
        $validator = Validator::make($request->all(), [
            'UserID' => 'required|integer|exists:users,UserID',
            'Receiver_name' => 'required|string|max:255',
            'Receiver_phone' => 'required|string|max:20',
            'Shipping_address' => 'required|string|max:500',
            'VoucherID' => 'nullable|integer|exists:vouchers,VoucherID',
            'PaymentID' => 'required|integer|exists:payment_gateways,PaymentID',
            'Status' => ['required', 'string', Rule::in(['pending', 'processing', 'completed', 'cancelled'])],
            'products' => 'required|array|min:1',
            'products.*.id' => 'nullable|exists:order_items,orderid', // ID của order_item có thể rỗng (nếu là item mới) hoặc phải tồn tại.
            'products.*.product_variant_id' => 'required|integer|exists:productvariants,id',
            'products.*.quantity' => 'required|integer|min:1',
        ], [
            // Thông báo lỗi tùy chỉnh.
            'UserID.required' => 'ID người dùng là bắt buộc.',
            'UserID.exists' => 'Người dùng không tồn tại.',
            'Receiver_name.required' => 'Tên người nhận là bắt buộc.',
            'Receiver_phone.required' => 'Số điện thoại người nhận là bắt buộc.',
            'Shipping_address.required' => 'Địa chỉ giao hàng là bắt buộc.',
            'VoucherID.exists' => 'Voucher không tồn tại.',
            'PaymentID.required' => 'ID phương thức thanh toán là bắt buộc.',
            'PaymentID.exists' => 'Phương thức thanh toán không tồn tại.',
            'Status.required' => 'Trạng thái đơn hàng là bắt buộc.',
            'Status.in' => 'Trạng thái đơn hàng không hợp lệ. Chỉ chấp nhận "pending", "processing", "completed", hoặc "cancelled".',
            'products.required' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'products.array' => 'Danh sách sản phẩm phải là một mảng.',
            'products.min' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'products.*.product_variant_id.required' => 'ID biến thể sản phẩm là bắt buộc cho mỗi mặt hàng.',
            'products.*.product_variant_id.exists' => 'Biến thể sản phẩm không tồn tại.',
            'products.*.quantity.required' => 'Số lượng là bắt buộc cho mỗi mặt hàng.',
            'products.*.quantity.integer' => 'Số lượng phải là số nguyên.',
            'products.*.quantity.min' => 'Số lượng phải lớn hơn hoặc bằng 1.',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction(); // Bắt đầu một transaction.
        try {
            // Cập nhật các thuộc tính của đơn hàng chính, sử dụng tên cột từ Model Order.
            $order->UserID = $request->UserID;
            $order->VoucherID = $request->VoucherID;
            $order->PaymentID = $request->PaymentID;
            $order->Receiver_name = $request->Receiver_name;
            $order->Receiver_phone = $request->Receiver_phone;
            $order->Shipping_address = $request->Shipping_address;
            $order->Status = $request->Status;
            $order->Update_at = now(); // Cập nhật thời gian cập nhật thủ công
            // Total_amount sẽ được tính lại sau khi xử lý order_items
            $order->save();

            $totalAmount = 0;
            $updatedItemIds = []; // Mảng lưu trữ IDs của các order_item đã được xử lý (cập nhật hoặc thêm mới)

            foreach ($request->products as $item) {
                $variant = ProductVariant::find($item['product_variant_id']);
                if (!$variant) {
                    throw new \Exception("Biến thể sản phẩm với ID {$item['product_variant_id']} không tồn tại.");
                }

                $unitPrice = $variant->price;
                $subtotal = $unitPrice * $item['quantity'];
                $totalAmount += $subtotal;

                if (isset($item['id'])) { // Nếu có ID, đây là mặt hàng hiện có cần cập nhật
                    // Tìm OrderDetail bằng orderid (primary key hoặc custom key)
                    $orderItem = OrderItem::find($item['id']);
                    // Đảm bảo item thuộc về order này và khớp orderid
                    if ($orderItem && $orderItem->orderid === $order->OrderID) {
                        $orderItem->update([
                            'product_id' => $variant->product_id,
                            'product_variant_id' => $variant->id,
                            'quantity' => $item['quantity'],
                            'unit_price' => $unitPrice,
                            'subtotal' => $subtotal,
                        ]);
                        $updatedItemIds[] = $orderItem->orderid; // Sử dụng orderid của OrderItem
                    } else {
                        // Xử lý trường hợp ID item không hợp lệ hoặc không thuộc order này
                        throw new \Exception("Mặt hàng đơn hàng với ID {$item['id']} không hợp lệ hoặc không thuộc đơn hàng này.");
                    }
                } else { // Không có ID, đây là mặt hàng mới cần thêm
                    $newItem = $order->orderDetails()->create([ // Sử dụng mối quan hệ orderDetails
                        'product_id' => $variant->product_id,
                        'product_variant_id' => $variant->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'subtotal' => $subtotal,
                        'orderid' => $order->OrderID, // Đảm bảo gán orderid
                    ]);
                    $updatedItemIds[] = $newItem->orderid; // Sử dụng orderid của OrderItem
                }
            }

            // Xóa các mặt hàng cũ không còn trong yêu cầu cập nhật
            // Sử dụng mối quan hệ orderDetails và cột khóa chính/ngoại của OrderItem
            $order->orderDetails()->whereNotIn('orderid', $updatedItemIds)->delete();

            // Cập nhật lại tổng số tiền của đơn hàng
            $order->Total_amount = $totalAmount;
            $order->save(); // Lưu lại tổng tiền đã cập nhật

            DB::commit(); // Commit transaction.

            // Trả về phản hồi JSON thông báo cập nhật thành công.
            // Sử dụng các tên mối quan hệ từ Model Order của bạn: 'user', 'voucher', 'paymentGateway', 'orderDetails'
            return response()->json(['message' => 'Đơn hàng đã được cập nhật thành công.', 'order' => $order->load(['user', 'voucher', 'paymentGateway', 'orderDetails.productVariant.product'])]);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction nếu có lỗi xảy ra.
            return response()->json(['message' => 'Có lỗi xảy ra khi cập nhật đơn hàng: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Xóa một đơn hàng.
     * Xử lý yêu cầu DELETE đến /api/admin/orders/{id}
     *
     * @param  int  $id ID của đơn hàng cần xóa.
     * @return \Illuminate\Http\JsonResponse Trả về thông báo thành công.
     */
    public function destroy($id) // Phương thức này xử lý việc xóa đơn hàng.
    {
        // Sử dụng OrderID làm khóa chính
        $order = Order::find($id); // Tìm đơn hàng cần xóa bằng ID.

        if (!$order) { // Nếu không tìm thấy đơn hàng.
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        }

        DB::beginTransaction(); // Bắt đầu một transaction.
        try {
            // Xóa tất cả các order_items liên quan trước, sử dụng mối quan hệ orderDetails
            $order->orderDetails()->delete();
            // Sau đó xóa đơn hàng
            $order->delete(); // Xóa bản ghi đơn hàng khỏi cơ sở dữ liệu.

            DB::commit(); // Commit transaction.
            return response()->json(['message' => 'Đơn hàng và các mặt hàng liên quan đã được xóa thành công.'], 200); // Trả về thông báo thành công.
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction nếu có lỗi xảy ra.
            return response()->json(['message' => 'Có lỗi xảy ra khi xóa đơn hàng: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Cập nhật trạng thái của một đơn hàng.
     * Xử lý yêu cầu PATCH đến /api/admin/orders/{id}/status
     *
     * @param  \Illuminate\Http\Request  $request Dữ liệu yêu cầu từ client (chứa 'status' mới).
     * @param  int  $id ID của đơn hàng cần cập nhật trạng thái.
     * @return \Illuminate\Http\JsonResponse Trả về thông báo thành công và dữ liệu đơn hàng đã cập nhật.
     */
    public function toggleStatus(Request $request, $id) // Phương thức này xử lý việc chuyển đổi trạng thái.
    {
        // Sử dụng OrderID làm khóa chính
        $order = Order::find($id); // Tìm đơn hàng cần cập nhật trạng thái.

        if (!$order) { // Nếu không tìm thấy đơn hàng.
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        }

        // Xác thực dữ liệu đầu vào cho trạng thái, sử dụng tên cột từ Model Order.
        $validator = Validator::make($request->all(), [
            'Status' => ['required', 'string', Rule::in(['pending', 'processing', 'completed', 'cancelled'])],
        ], [
            'Status.required' => 'Trạng thái là bắt buộc.',
            'Status.in' => 'Trạng thái không hợp lệ. Chỉ chấp nhận "pending", "processing", "completed", hoặc "cancelled".',
        ]);

        if ($validator->fails()) { // Kiểm tra nếu xác thực thất bại.
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order->Status = $request->Status; // Cập nhật trạng thái.
        $order->save(); // Lưu thay đổi.

        // Trả về phản hồi JSON thông báo cập nhật thành công.
        return response()->json(['message' => 'Trạng thái đơn hàng đã được cập nhật thành công.', 'order' => $order]);
    }
}
