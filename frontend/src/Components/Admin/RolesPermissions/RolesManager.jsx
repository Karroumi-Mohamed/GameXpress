import React, { useState } from 'react';
import api from '../../../lib/axios.js';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Modal from '../../Common/Modal.jsx';

const RolesManager = React.forwardRef(({ roles, fetchRoles }, ref) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [editingRole, setEditingRole] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) {
            toast.warn("Role name cannot be empty.");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post('/admin/roles', { name: newRoleName });
            toast.success(`Role '${newRoleName}' created successfully!`);
            setNewRoleName('');
            setIsAddModalOpen(false);
            fetchRoles();
        } catch (err) {
            console.error("Failed to add role:", err);
            toast.error(err.response?.data?.message || "Failed to create role.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditRole = (role) => {
        setEditingRole({ ...role });
        setIsEditModalOpen(true);
    };

    const handleUpdateRole = async (e) => {
        e.preventDefault();
        if (!editingRole || !editingRole.name.trim()) {
            toast.warn("Role name cannot be empty.");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.put(`/admin/roles/${editingRole.id}`, { name: editingRole.name });
            toast.success(`Role updated successfully!`);
            setIsEditModalOpen(false);
            setEditingRole(null);
            fetchRoles();
        } catch (err) {
            console.error("Failed to update role:", err);
            toast.error(err.response?.data?.message || "Failed to update role.");
        } finally {
            setIsSubmitting(false);
        }
    };

     const handleDeleteRole = async (roleId, roleName) => {
        if (window.confirm(`Are you sure you want to delete the role '${roleName}'? This will also remove associated permissions from users with this role.`)) {
            setIsSubmitting(true);
            try {
                await api.delete(`/admin/roles/${roleId}`);
                toast.success(`Role '${roleName}' deleted successfully!`);
                fetchRoles();
            } catch (err) {
                console.error("Failed to delete role:", err);
                toast.error(err.response?.data?.message || "Failed to delete role.");
            } finally {
                 setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="mb-6">
            <div className="flex justify-end">
                 <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Role
                </button>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Role">
                <form onSubmit={handleAddRole}>
                    <div className="mb-4">
                        <label htmlFor="roleName" className="block text-sm font-medium text-slate-700 mb-1">
                            Role Name
                        </label>
                        <input
                            type="text"
                            id="roleName"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                            placeholder="e.g., content_editor"
                            required
                        />
                         <p className="mt-1 text-xs text-slate-500">Use snake_case for consistency (e.g., product_manager).</p>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                         <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                        >
                             <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            {isSubmitting ? 'Adding...' : 'Add Role'}
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

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Role Name">
                 {editingRole && (
                    <form onSubmit={handleUpdateRole}>
                        <div className="mb-4">
                            <label htmlFor="editRoleName" className="block text-sm font-medium text-slate-700 mb-1">
                                Role Name
                            </label>
                            <input
                                type="text"
                                id="editRoleName"
                                value={editingRole.name}
                                onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                                required
                            />
                             <p className="mt-1 text-xs text-slate-500">Use snake_case for consistency.</p>
                        </div>
                         <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
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

             {React.useImperativeHandle(ref, () => ({
                handleEditRole,
                handleDeleteRole
             }))}

        </div>
    );
});


export default RolesManager;
