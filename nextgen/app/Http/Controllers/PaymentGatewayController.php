<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentGatewayController extends Controller
{
    /**
     * Display a listing of the resource.
     * Lấy danh sách tất cả các cổng thanh toán.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $gateways = PaymentGateway::all();
            return response()->json([
                'success' => true,
                'data' => $gateways,
                'message' => 'Lấy danh sách cổng thanh toán thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh sách cổng thanh toán',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * Store a newly created resource in storage.
     * Tạo một cổng thanh toán mới.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'Name' => 'required|string|max:255|unique:payment_gateway,Name'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $gateway = PaymentGateway::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $gateway,
                'message' => 'Tạo cổng thanh toán thành công'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi tạo cổng thanh toán',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * Hiển thị thông tin chi tiết của một cổng thanh toán.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $gateway = PaymentGateway::with('orders')->find($id);

            if (!$gateway) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy cổng thanh toán'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $gateway,
                'message' => 'Lấy thông tin cổng thanh toán thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy thông tin cổng thanh toán',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * Cập nhật thông tin của một cổng thanh toán.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $gateway = PaymentGateway::find($id);

            if (!$gateway) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy cổng thanh toán'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'Name' => 'required|string|max:255|unique:payment_gateway,Name,' . $id . ',PaymentID'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $gateway->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $gateway->fresh(),
                'message' => 'Cập nhật cổng thanh toán thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật cổng thanh toán',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Xóa một cổng thanh toán.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $gateway = PaymentGateway::find($id);

            if (!$gateway) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy cổng thanh toán'
                ], 404);
            }

            // Kiểm tra xem có đơn hàng nào đang sử dụng cổng thanh toán này không
            if ($gateway->orders()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa cổng thanh toán này vì đã có đơn hàng sử dụng'
                ], 400);
            }

            $gateway->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa cổng thanh toán thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi xóa cổng thanh toán',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
