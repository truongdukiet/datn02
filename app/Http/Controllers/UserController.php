<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    // GET /api/users/{id}
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);
        return response()->json($user, 200);
    }

    // POST /api/users/register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Username' => 'required|string|max:255|unique:users',
            'Email' => 'required|email|unique:users',
            'Password' => 'required|min:6',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $user = User::create([
            'Username' => $request->Username,
            'Email' => $request->Email,
            'Password' => Hash::make($request->Password),
            'Created_at' => now(),
            'Updated_at' => now()
        ]);

        return response()->json(['message' => 'Register success', 'user' => $user], 201);
    }

    // POST /api/users/login
    public function login(Request $request)
    {
        $user = User::where('Email', $request->Email)->first();

        if (!$user || !Hash::check($request->Password, $user->Password)) {
            return response()->json(['message' => 'Email or password is incorrect'], 401);
        }

        // Nếu dùng sanctum: $token = $user->createToken('token')->plainTextToken;
        return response()->json(['message' => 'Login success', 'user' => $user]);
    }

    // PUT /api/users/{id}
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->update($request->only([
            'Username', 'Email', 'Fullname', 'Phone', 'Address', 'Status', 'Role'
        ]));

        return response()->json(['message' => 'User updated', 'user' => $user]);
    }

    // DELETE /api/users/{id}
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
