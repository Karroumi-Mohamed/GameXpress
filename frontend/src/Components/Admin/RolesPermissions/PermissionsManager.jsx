import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios.js';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Modal from '../../Common/Modal.jsx';

const PermissionsManager = () => {
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newPermissionName, setNewPermissionName] = useState('');
    const [editingPermission, setEditingPermission] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPermissions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/permissions');
            setPermissions(response.data.data || response.data || []);
        } catch (err) {
            console.error("Failed to fetch permissions:", err);
            setError("Failed to load permissions.");
            toast.error("Failed to load permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const handleAddPermission = async (e) => {
        e.preventDefault();
        if (!newPermissionName.trim()) {
            toast.warn("Permission name cannot be empty.");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post('/admin/permissions', { name: newPermissionName });
            toast.success(`Permission '${newPermissionName}' created successfully!`);
            setNewPermissionName('');
            setIsAddModalOpen(false);
            fetchPermissions();
        } catch (err) {
            console.error("Failed to add permission:", err);
            toast.error(err.response?.data?.message || "Failed to create permission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditPermission = (permission) => {
        setEditingPermission({ ...permission });
        setIsEditModalOpen(true);
    };

    const handleUpdatePermission = async (e) => {
        e.preventDefault();
        if (!editingPermission || !editingPermission.name.trim()) {
            toast.warn("Permission name cannot be empty.");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.put(`/admin/permissions/${editingPermission.id}`, { name: editingPermission.name });
            toast.success(`Permission updated successfully!`);
            setIsEditModalOpen(false);
            setEditingPermission(null);
            fetchPermissions();
        } catch (err) {
            console.error("Failed to update permission:", err);
            toast.error(err.response?.data?.message || "Failed to update permission.");
        } finally {
            setIsSubmitting(false);
        }
    };

     const handleDeletePermission = async (permissionId, permissionName) => {
        if (window.confirm(`Are you sure you want to delete the permission '${permissionName}'? This action cannot be undone.`)) {
            setIsSubmitting(true);
            try {
                await api.delete(`/admin/permissions/${permissionId}`);
                toast.success(`Permission '${permissionName}' deleted successfully!`);
                fetchPermissions();
            } catch (err) {
                console.error("Failed to delete permission:", err);
                toast.error(err.response?.data?.message || "Failed to delete permission.");
            } finally {
                 setIsSubmitting(false);
            }
        }
    };


    if (isLoading) {
        return <div className="p-4 text-center">Loading permissions...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600 text-center">{error}</div>;
    }

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Manage Permissions</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Permission
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Permission Name</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {permissions.length > 0 ? permissions.map((permission) => (
                            <tr key={permission.id} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{permission.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEditPermission(permission)}
                                        title="Edit Permission"
                                        disabled={isSubmitting}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-100 rounded disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeletePermission(permission.id, permission.name)}
                                        title="Delete Permission"
                                        disabled={isSubmitting}
                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={2} className="px-6 py-10 text-center text-sm text-slate-500">
                                    No permissions found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Permission">
                <form onSubmit={handleAddPermission}>
                    <div className="mb-4">
                        <label htmlFor="permissionName" className="block text-sm font-medium text-slate-700 mb-1">
                            Permission Name
                        </label>
                        <input
                            type="text"
                            id="permissionName"
                            value={newPermissionName}
                            onChange={(e) => setNewPermissionName(e.target.value)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                            placeholder="e.g., manage_users"
                            required
                        />
                         <p className="mt-1 text-xs text-slate-500">Use snake_case for consistency (e.g., edit_posts).</p>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                         <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                        >
                             <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            {isSubmitting ? 'Adding...' : 'Add Permission'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                             <XMarkIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Permission">
                 {editingPermission && (
                    <form onSubmit={handleUpdatePermission}>
                        <div className="mb-4">
                            <label htmlFor="editPermissionName" className="block text-sm font-medium text-slate-700 mb-1">
                                Permission Name
                            </label>
                            <input
                                type="text"
                                id="editPermissionName"
                                value={editingPermission.name}
                                onChange={(e) => setEditingPermission({ ...editingPermission, name: e.target.value })}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                                required
                            />
                             <p className="mt-1 text-xs text-slate-500">Use snake_case for consistency (e.g., edit_posts).</p>
                        </div>
                         <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                            >
                                 <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            >
                                 <XMarkIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Cancel
                            </button>
                        </div>
                    </form>
                 )}
            </Modal>
        </div>
    );
};

export default PermissionsManager;
