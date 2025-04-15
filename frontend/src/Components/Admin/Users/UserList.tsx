import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { toast } from 'react-toastify';
import { UsersIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../Common/Modal';
import UserForm from './UserForm';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: Role[];
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get<{ data: User[] }>('/admin/users');
            setUsers(response.data.data || response.data || []);
        } catch (err: any) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load users. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveSuccess = () => {
        handleCloseModal();
        fetchUsers();
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User deleted successfully!');
            fetchUsers();
        } catch (err: any) {
            console.error("Failed to delete user:", err);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading users...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600 text-center">Error loading users: {error}</div>;
    }

    return (
        <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-purple-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                    <UsersIcon className="h-8 w-8 mr-3 text-accent-500" />
                    Manage Users
                </h1>
                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/75">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Roles</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                            <th scope="col" className="relative px-6 py-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {users.length > 0 ? users.map((user) => (
                            <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {user.roles?.map(role => role.name).join(', ') || 'No Roles'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {new Date(user.created_at).toLocaleDateString('en-CA')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                    <button
                                        onClick={() => handleOpenEditModal(user)}
                                        title="Edit User"
                                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center p-1.5 hover:bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        title="Delete User"
                                        className="text-red-600 hover:text-red-800 inline-flex items-center p-1.5 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        <span className="sr-only">Delete</span>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <UsersIcon className="mx-auto h-12 w-12 text-slate-300" />
                                    <h3 className="mt-2 text-sm font-medium text-slate-800">No users found</h3>
                                    <p className="mt-1 text-sm text-slate-500">Get started by adding a new user.</p>
                                    <div className="mt-6">
                                        <button
                                            onClick={handleOpenAddModal}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                        >
                                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            New User
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? 'Edit User' : 'Add New User'}
                size="lg"
             >
                <UserForm
                    userToEdit={editingUser}
                    onSaveSuccess={handleSaveSuccess}
                    onCancel={handleCloseModal}
                />
             </Modal>
        </div>
    );
};

export default UserList;
