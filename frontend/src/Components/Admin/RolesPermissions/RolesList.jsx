import React, { useState, useEffect, useRef } from 'react';
import api from '../../../lib/axios.js';
import { ShieldCheckIcon, LockClosedIcon, PencilIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Modal from '../../Common/Modal.jsx';
import PermissionAssignmentForm from './PermissionAssignmentForm.jsx';
import RolesManager from './RolesManager.jsx';
import PermissionsManager from './PermissionsManager.jsx';


const RolesList = () => {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState(null);
    const rolesManagerRef = useRef();

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


    const handleOpenPermissionModal = (role) => {
        setSelectedRoleForPermissions(role);
        setIsPermissionModalOpen(true);
    };

    const handleClosePermissionModal = () => {
        setIsPermissionModalOpen(false);
        setSelectedRoleForPermissions(null);
    };

    const handlePermissionSaveSuccess = () => {
        handleClosePermissionModal();
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
                 <RolesManager ref={rolesManagerRef} roles={roles} fetchRoles={fetchRoles} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-x-auto mb-10">
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleOpenPermissionModal(role)}
                                        title="Edit Permissions"
                                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-100 rounded disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit Permissions</span>
                                    </button>
                                     <button
                                        onClick={() => rolesManagerRef.current?.handleEditRole(role)}
                                        title="Edit Role Name"
                                        className="text-teal-600 hover:text-teal-900 p-1 hover:bg-teal-100 rounded disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit Role Name</span>
                                    </button>
                                     <button
                                        onClick={() => rolesManagerRef.current?.handleDeleteRole(role.id, role.name)}
                                        title="Delete Role"
                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        <span className="sr-only">Delete Role</span>
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
                isOpen={isPermissionModalOpen}
                onClose={handleClosePermissionModal}
                title={`Edit Permissions for ${selectedRoleForPermissions?.name?.replace('_', ' ') ?? 'Role'}`}
                size="xl"
             >
                 {isPermissionModalOpen && selectedRoleForPermissions && (
                    <PermissionAssignmentForm
                        role={selectedRoleForPermissions}
                        onSaveSuccess={handlePermissionSaveSuccess}
                        onCancel={handleClosePermissionModal}
                    />
                 )}
             </Modal>

             <PermissionsManager />
        </div>
    );
};

export default RolesList;
