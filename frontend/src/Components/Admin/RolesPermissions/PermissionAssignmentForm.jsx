import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios.js';
import { toast } from 'react-toastify';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';


const PermissionAssignmentForm = ({ role, onSaveSuccess, onCancel }) => {
    const [assignedPermissions, setAssignedPermissions] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPermissions, setIsFetchingPermissions] = useState(true);

    useEffect(() => {
        if (role) {
            setAssignedPermissions(role.permissions?.map(p => p.id) || []);
        } else {
            setAssignedPermissions([]);
        }
    }, [role]);

    useEffect(() => {
        const fetchAllPermissions = async () => {
            setIsFetchingPermissions(true);
            try {
                const response = await api.get('/admin/permissions');
                setAllPermissions(response.data.data || response.data || []);
            } catch (err) {
                console.error("Failed to fetch all permissions:", err);
                toast.error("Could not load available permissions.");
            } finally {
                setIsFetchingPermissions(false);
            }
        };
        fetchAllPermissions();
    }, []);

    const handlePermissionChange = (event) => {
        const permissionId = parseInt(event.target.value, 10);
        const isChecked = event.target.checked;

        setAssignedPermissions(prev => {
            if (isChecked) {
                return [...prev, permissionId];
            } else {
                return prev.filter(id => id !== permissionId);
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!role) return;

        setIsLoading(true);

        const initialPermissionNames = role.permissions?.map(p => p.name) || [];
        const assignedPermissionObjects = allPermissions.filter(p => assignedPermissions.includes(p.id));
        const assignedPermissionNames = assignedPermissionObjects.map(p => p.name);

        const permissionsToAddNames = assignedPermissionNames.filter(name => !initialPermissionNames.includes(name));
        const permissionsToRemoveNames = initialPermissionNames.filter(name => !assignedPermissionNames.includes(name));


        try {
            const addPromises = permissionsToAddNames.map(permissionName =>
                api.post(`/admin/roles/${role.id}/add-permission`, { permission_name: permissionName })
            );
            const removePromises = permissionsToRemoveNames.map(permissionName =>
                 api.post(`/admin/roles/${role.id}/remove-permission`, { permission_name: permissionName })
            );

            await Promise.all([...addPromises, ...removePromises]);

            toast.success(`Permissions for role '${role.name}' updated successfully!`);
            onSaveSuccess();

        } catch (err) {
            console.error("Failed to update permissions:", err);
            toast.error(err.response?.data?.message || "Failed to update permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingPermissions) {
        return <div className="p-6 text-center">Loading permissions...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <p className="text-sm text-slate-600 mb-4">Select the permissions to assign to the '{role?.name?.replace('_', ' ')}' role.</p>
                {allPermissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                        {allPermissions.map(permission => (
                            <div key={permission.id} className="flex items-center">
                                <input
                                    id={`perm-${permission.id}`}
                                    name="permissions"
                                    type="checkbox"
                                    value={permission.id}
                                    checked={assignedPermissions.includes(permission.id)}
                                    onChange={handlePermissionChange}
                                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={`perm-${permission.id}`} className="ml-3 block text-sm text-slate-700">
                                    {permission.name}
                                </label>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">No permissions found.</p>
                )}
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200">
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <XMarkIcon className="h-5 w-5 mr-1 inline-block align-text-bottom" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !role}
                        className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {isLoading ? 'Saving...' : 'Update Permissions'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PermissionAssignmentForm;
