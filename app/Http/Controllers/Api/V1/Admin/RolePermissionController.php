<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();

        return response()->json([
            'success' => true,
            'data' => $roles,
        ], 200);
    }

    public function show($roleId)
    {
        $role = Role::with('permissions')->find($roleId);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'role' => $role,
                'permissions' => $role->permissions,
            ],
        ], 200);
    }

    public function addPermission(Request $request, $roleId)
    {
        $request->validate([
            'permission_name' => 'required|string|exists:permissions,name',
        ]);

        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }

        $permission = Permission::where('name', $request->permission_name)->first();

        if (!$permission) {
            return response()->json([
                'success' => false,
                'message' => 'Permission not found',
            ], 404);
        }

        $role->givePermissionTo($permission);

        return response()->json([
            'success' => true,
            'message' => 'Permission added to role successfully',
            'data' => [
                'role' => $role,
                'permissions' => $role->permissions,
            ],
        ], 200);
    }

    public function removePermission(Request $request, $roleId)
    {
        $request->validate([
            'permission_name' => 'required|string|exists:permissions,name',
        ]);

        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }

        $permission = Permission::where('name', $request->permission_name)->first();

        if (!$permission) {
            return response()->json([
                'success' => false,
                'message' => 'Permission not found',
            ], 404);
        }

        $role->revokePermissionTo($permission);

        return response()->json([
            'success' => true,
            'message' => 'Permission removed from role successfully',
            'data' => [
                'role' => $role,
                'permissions' => $role->permissions,
            ],
        ], 200);
    }

    public function requestRolePermission(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permission_name' => 'required|string|exists:permissions,name',
        ]);

        $role = Role::find($request->role_id);

        $permission = Permission::where('name', $request->permission_name)->first();


        return response()->json([
            'success' => true,
            'message' => 'Permission request sent successfully',
            'data' => [
                'role' => $role,
                'permission' => $permission,
            ],
        ], 200);
    }


    public function getPermissions()
    {
        $permissions = Permission::all();

        return response()->json([
            'success' => true,
            'data' => $permissions,
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
        ]);

        $role = Role::create(['name' => $request->name]);

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully',
            'data' => $role,
        ], 201);
    }

    public function update(Request $request, $roleId)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $roleId,
        ]);

        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }

        $role->name = $request->name;
        $role->save();

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully',
            'data' => $role,
        ], 200);
    }

    public function distroy($roleId)
    {
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully',
        ], 200);
    }

    public function storePermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        $permission = Permission::create(['name' => $request->name]);

        return response()->json([
            'success' => true,
            'message' => 'Permission created successfully',
            'data' => $permission,
        ], 201);
    }

    public function updatePermission(Request $request, $permissionId)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permissionId,
        ]);

        $permission = Permission::find($permissionId);

        if (!$permission) {
            return response()->json([
                'success' => false,
                'message' => 'Permission not found',
            ], 404);
        }

        $permission->name = $request->name;
        $permission->save();

        return response()->json([
            'success' => true,
            'message' => 'Permission updated successfully',
            'data' => $permission,
        ], 200);
    }

    public function distroyPermission($permissionId)
    {
        $permission = Permission::find($permissionId);

        if (!$permission) {
            return response()->json([
                'success' => false,
                'message' => 'Permission not found',
            ], 404);
        }

        $permission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Permission deleted successfully',
        ], 200);
    }

}
