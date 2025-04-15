import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios.js';
import { toast } from 'react-toastify';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import * as Yup from 'yup';


const UserForm = ({ userToEdit, onSaveSuccess, onCancel }) => {
    const isEditing = Boolean(userToEdit);
    const [formData, setFormData] = useState({
        name: userToEdit?.name || '',
        email: userToEdit?.email || '',
        password: '',
        password_confirmation: '',
        roles: userToEdit?.roles?.map(role => role.id) || [],
    });
    const [availableRoles, setAvailableRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState({});
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get('/admin/roles');
                setAvailableRoles(response.data.data || response.data || []);
            } catch (err) {
                console.error("Failed to fetch roles:", err);
                toast.error("Could not load roles for assignment.");
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        setFormData({
            name: userToEdit?.name || '',
            email: userToEdit?.email || '',
            password: '',
            password_confirmation: '',
            roles: userToEdit?.roles?.map(role => role.id) || [],
        });
        setApiErrors({});
        setFormErrors({});
    }, [userToEdit]);

    const userSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
            .when([], {
                is: () => !isEditing,
                then: schema => schema.required('Password is required for new users').min(8, 'Password must be at least 8 characters'),
                otherwise: schema => schema.optional().min(8, 'Password must be at least 8 characters if provided'),
            }),
        password_confirmation: Yup.string()
            .when('password', ([password], schema) => {
                return password ? schema.required('Password confirmation is required').oneOf([Yup.ref('password')], 'Passwords must match') : schema.optional();
            }),
        roles: Yup.array().of(Yup.number()).min(1, 'At least one role must be selected').required(),
    });


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (event) => {
        const roleId = parseInt(event.target.value, 10);
        const isChecked = event.target.checked;

        setFormData(prev => {
            const currentRoles = prev.roles || [];
            if (isChecked) {
                return { ...prev, roles: [...currentRoles, roleId] };
            } else {
                return { ...prev, roles: currentRoles.filter(id => id !== roleId) };
            }
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setApiErrors({});
        setFormErrors({});

        try {
            await userSchema.validate(formData, { abortEarly: false });
        } catch (validationError) {
            const yupErrors = {};
            if (validationError.inner) {
                validationError.inner.forEach((error) => {
                    if (error.path) yupErrors[error.path] = error.message;
                });
            }
            setFormErrors(yupErrors);
            setIsLoading(false);
            toast.error("Client-side validation failed. Please check the form.");
            return;
        }

        const apiData = { ...formData };
        if (isEditing && !apiData.password) {
            delete apiData.password;
            delete apiData.password_confirmation;
        } else if (!isEditing && !apiData.password) {
             setFormErrors({ password: 'Password is required for new users.' });
             setIsLoading(false);
             return;
        }

        try {
            if (isEditing && userToEdit) {
                await api.put(`/admin/users/${userToEdit.id}`, apiData);
                toast.success('User updated successfully!');
            } else {
                await api.post('/admin/users', apiData);
                toast.success('User created successfully!');
            }
            onSaveSuccess();
        } catch (err) {
            console.error("Failed to save user:", err);
            if (err.response?.status === 422) {
                setApiErrors(err.response.data.errors);
                toast.error('API Validation failed. Please check the form fields.');
            } else {
                toast.error(err.response?.data?.message || "Failed to save user.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const hasError = (fieldName) => Boolean(apiErrors[fieldName] || formErrors[fieldName]);

    const inputClass = (fieldName) =>
        `block w-full px-4 py-2 text-slate-900 border ${hasError(fieldName) ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 ${hasError(fieldName) ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm transition duration-150 ease-in-out`;

    const displayError = (fieldName) => {
        const errorMsg = formErrors[fieldName] || apiErrors[fieldName]?.[0];
        return errorMsg ? <p className="mt-1 text-xs text-red-600">{errorMsg}</p> : null;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={inputClass('name')} placeholder="e.g., John Doe" required />
                    {displayError('name')}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className={inputClass('email')} placeholder="e.g., john.doe@example.com" required />
                    {displayError('email')}
                </div>
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                        Password {isEditing ? '(Leave blank to keep current)' : ''}
                    </label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} className={inputClass('password')} placeholder="Enter password" required={!isEditing} />
                    {displayError('password')}
                </div>
                 {(formData.password || !isEditing) && (
                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <input type="password" name="password_confirmation" id="password_confirmation" value={formData.password_confirmation} onChange={handleInputChange} className={inputClass('password_confirmation')} placeholder="Confirm password" required={!isEditing || !!formData.password} />
                        {displayError('password_confirmation')}
                    </div>
                 )}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Assign Roles</label>
                    <div className="space-y-2">
                        {availableRoles.length > 0 ? availableRoles.map(role => (
                            <div key={role.id} className="flex items-center">
                                <input
                                    id={`role-${role.id}`}
                                    name="roles"
                                    type="checkbox"
                                    value={role.id}
                                    checked={formData.roles?.includes(role.id)}
                                    onChange={handleRoleChange}
                                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={`role-${role.id}`} className="ml-3 block text-sm text-slate-700 capitalize">
                                    {role.name.replace('_', ' ')}
                                </label>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500">No roles available.</p>
                        )}
                    </div>
                     {displayError('roles')}
                 </div>
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
                        disabled={isLoading}
                        className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {isLoading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default UserForm;
