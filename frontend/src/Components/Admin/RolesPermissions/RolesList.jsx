import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios.js';
import { ShieldCheckIcon, LockClosedIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '../../Common/Modal.jsx';
import PermissionAssignmentForm from './PermissionAssignmentForm.jsx';


const RolesList = () => {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const fetchRoles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/roles');
            setRoles(response.data.data || response.data || []);
        } catch (err) {
            console.error("Failed to fetch roles:", err);
            setError("Failed to load roles. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleOpenEditModal = (role) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRole(null);
    };

    const handleSaveSuccess = () => {
        handleCloseModal();
        fetchRoles();
    };


    if (isLoading) {
        return <div className="p-8 text-center">Loading roles and permissions...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600 text-center">Error loading roles: {error}</div>;
    }

    return (
        <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-teal-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                    <ShieldCheckIcon className="h-8 w-8 mr-3 text-accent-500" />
                    Manage Roles & Permissions
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/75">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role Name</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</th>
                            <th scope="col" className="relative px-6 py-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {roles.length > 0 ? roles.map((role) => (
                            <tr key={role.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-slate-900 capitalize">{role.name.replace('_', ' ')}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions?.length > 0 ? role.permissions.map(permission => (
                                            <span key={permission.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {permission.name}
                                            </span>
                                        )) : (
                                            <span className="text-sm text-slate-400">No permissions assigned</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                    <button
                                        onClick={() => handleOpenEditModal(role)}
                                        title="Edit Permissions"
                                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center p-1.5 hover:bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit Permissions</span>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-16 text-center">
                                    <LockClosedIcon className="mx-auto h-12 w-12 text-slate-300" />
                                    <h3 className="mt-2 text-sm font-medium text-slate-800">No roles found</h3>
                                    <p className="mt-1 text-sm text-slate-500">Roles might be defined in the backend.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

             <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Edit Permissions for ${selectedRole?.name.replace('_', ' ')}`}
                size="xl"
             >
                 <PermissionAssignmentForm
                    role={selectedRole}
                    onSaveSuccess={handleSaveSuccess}
                    onCancel={handleCloseModal}
                />
             </Modal>
        </div>
    );
};

export default RolesList;
