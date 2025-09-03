<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::all();
            return response()->json(['success' => true, 'data' => $users]);
        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }
            return response()->json(['success' => true, 'data' => $user]);
        } catch (\Exception $e) {
            Log::error('Error fetching user: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'Username' => 'required|string|max:255|unique:users,Username',
                'Password' => 'required|string|min:6',
                'Email' => 'required|email|unique:users,Email',
                'Fullname' => 'nullable|string|max:255',
                'Phone' => 'nullable|string|max:255',
                'Address' => 'nullable|string|max:255',
                'Status' => 'nullable|boolean',
                'Role' => 'nullable|integer|in:0,1',
            ]);

            $validated['Password'] = bcrypt($validated['Password']);
            $validated['Created_at'] = now();
            $validated['Updated_at'] = now();

            $user = User::create($validated);
            return response()->json(['success' => true, 'data' => $user], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating user: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'Fullname' => 'sometimes|string|max:255',
                'Phone' => 'sometimes|string|max:20',
                'Address' => 'sometimes|string|max:500',
                'Email' => 'sometimes|email|max:255|unique:users,Email,' . $id . ',UserID',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update($request->only(['Fullname', 'Phone', 'Address', 'Email']));

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }

            if ($user->Role === 1) {
                $adminCount = User::where('Role', 1)->count();
                if ($adminCount <= 1) {
                    return response()->json(['success' => false, 'message' => 'Không thể xóa admin cuối cùng'], 400);
                }
            }

            $user->delete();
            return response()->json(['success' => true, 'message' => 'User deleted successfully']);
        } catch (QueryException $e) {
            Log::error('Database error deleting user: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Không thể xóa user do có dữ liệu liên quan'], 400);
        } catch (\Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }
    }

    public function getProfile($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }
            return response()->json(['success' => true, 'data' => $user], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching profile: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }
    }

    public function changePassword(Request $request, $id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }

            $validated = $request->validate([
                'currentPassword' => 'required|string',
                'newPassword' => 'required|string|min:6',
            ]);

            // Kiểm tra mật khẩu hiện tại
            if (!\Hash::check($validated['currentPassword'], $user->Password)) {
                return response()->json(['success' => false, 'message' => 'Mật khẩu hiện tại không đúng'], 400);
            }

            // Đổi mật khẩu
            $user->Password = bcrypt($validated['newPassword']);
            $user->Updated_at = now();
            $user->save();

            return response()->json(['success' => true, 'message' => 'Đổi mật khẩu thành công']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Error changing password: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }
    }
}
