import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios.js';
import { toast } from 'react-toastify';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';


const CategoryForm = ({ categoryToEdit, onSaveSuccess, onCancel }) => {
    const isEditing = Boolean(categoryToEdit);
    const [formData, setFormData] = useState({
        name: categoryToEdit?.name || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({ name: categoryToEdit?.name || '' });
        setErrors({});
    }, [categoryToEdit]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            if (isEditing && categoryToEdit) {
                await api.put(`/admin/categories/${categoryToEdit.id}`, formData);
                toast.success('Category updated successfully!');
            } else {
                await api.post('/admin/categories', formData);
                toast.success('Category created successfully!');
            }
            onSaveSuccess();
        } catch (err) {
            console.error("Failed to save category:", err);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
                toast.error('Validation failed. Please check the form.');
            } else {
                const errorMessage = err.response?.data?.message || err.message || "Failed to save category.";
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Category Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`block w-full px-4 py-2 text-slate-900 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-brand-500 focus:border-brand-500'} sm:text-sm transition duration-150 ease-in-out`}
                        placeholder="e.g., Action Figures"
                        required
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
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
                            {isLoading ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CategoryForm;
