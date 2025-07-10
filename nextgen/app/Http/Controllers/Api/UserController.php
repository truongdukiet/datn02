<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json(['success' => true, 'data' => $users]);
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Username' => 'required|string|max:255|unique:users,Username',
            'Password' => 'required|string|min:6',
            'Email' => 'required|email|unique:users,Email',
            'Fullname' => 'nullable|string|max:255',
            'Phone' => 'nullable|string|max:255',
            'Address' => 'nullable|string|max:255',
            'Status' => 'nullable|boolean',
        ]);
        $validated['Password'] = bcrypt($validated['Password']);
        $user = User::create($validated);
        return response()->json(['success' => true, 'data' => $user], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
        $validated = $request->validate([
            'Username' => 'sometimes|string|max:255|unique:users,Username,' . $id . ',UserID',
            'Password' => 'sometimes|string|min:6',
            'Email' => 'sometimes|email|unique:users,Email,' . $id . ',UserID',
            'Fullname' => 'nullable|string|max:255',
            'Phone' => 'nullable|string|max:255',
            'Address' => 'nullable|string|max:255',
            'Status' => 'nullable|boolean',
        ]);
        if (isset($validated['Password'])) {
            $validated['Password'] = bcrypt($validated['Password']);
        }
        $user->update($validated);
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['success' => true, 'message' => 'User deleted']);
    }
}
