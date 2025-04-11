import React, { useState, useEffect } from 'react';
// Remove useParams, useNavigate, Link as they are not needed for modal form
// import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/axios';
import { toast } from 'react-toastify';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Use XMark for cancel

interface Category { // Define Category type for editing
    id: number;
    name: string;
    // Add other fields if needed
}

interface CategoryFormData {
    name: string;
}

interface CategoryFormProps {
    categoryToEdit?: Category | null; // Category data if editing
    onSaveSuccess: () => void; // Callback on successful save
    onCancel: () => void; // Callback to close modal
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryToEdit, onSaveSuccess, onCancel }) => {
    const isEditing = Boolean(categoryToEdit);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: categoryToEdit?.name || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // Reset form when categoryToEdit changes (e.g., opening modal for edit)
    useEffect(() => {
        setFormData({ name: categoryToEdit?.name || '' });
        setErrors({}); // Clear errors when modal opens/changes mode
    }, [categoryToEdit]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
            onSaveSuccess(); // Call success callback (closes modal, refreshes list)
        } catch (err: any) {
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

    // No need for isFetching state within the modal form itself

    return (
        <form onSubmit={handleSubmit}>
            {/* Main form content area */}
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
                {/* Add other fields like subcategory selection here if needed */}
            </div>

            {/* Form actions / footer */}
            <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex justify-end space-x-3">
                    <button
                        type="button" // Important: type="button" to prevent form submission
                        onClick={onCancel}
                        className="bg-white py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <XMarkIcon className="h-5 w-5 mr-1 inline-block align-text-bottom" />
                        Cancel
                    </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            // Temporarily use standard Tailwind colors for diagnosis
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
