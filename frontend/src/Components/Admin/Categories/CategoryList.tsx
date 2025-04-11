import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { toast } from 'react-toastify';
import { TagIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../Common/Modal'; 
import CategoryForm from './CategoryForm';

interface SubCategory {
    id: number;
    name: string;
    slug: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    sub_categories?: SubCategory[];
    products_count?: number; 
    created_at: string;
}

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); 

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get<{ data: Category[] }>('/admin/categories');
            setCategories(response.data.data || []);
        } catch (err: any) {
            console.error("Failed to fetch categories:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to load categories.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenAddModal = () => {
        setEditingCategory(null); 
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null); 
    };

    const handleSaveSuccess = () => {
        handleCloseModal();
        fetchCategories();
    };


    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category? This might affect associated products.')) {
            return;
        }
        try {
            await api.delete(`/admin/categories/${id}`);
            toast.success('Category deleted successfully!');
            fetchCategories(); // Refresh the list
        } catch (err: any) {
            console.error("Failed to delete category:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to delete category.";
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return <div className="p-8">Loading categories...</div>; 
    }

    if (error) {
        return <div className="p-8 text-red-600">Error loading categories: {error}</div>;
    }

    return (
        <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                    <TagIcon className="h-8 w-8 mr-3 text-accent-500" />
                    Manage Categories
                </h1>
                <button
                    onClick={handleOpenAddModal} 
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/75">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Sub-categories</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                            <th scope="col" className="relative px-6 py-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {categories.length > 0 ? categories.map((category) => (
                            <tr key={category.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-slate-900">{category.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{category.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {category.sub_categories?.length || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {category.products_count || 0}
                                    </span>
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {new Date(category.created_at).toLocaleDateString('en-CA')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                    <button
                                        onClick={() => handleOpenEditModal(category)} 
                                        title="Edit Category"
                                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center p-1.5 hover:bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                        <span className="sr-only">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        title="Delete Category"
                                        className="text-red-600 hover:text-red-800 inline-flex items-center p-1.5 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                        <span className="sr-only">Delete</span>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center">
                                    <TagIcon className="mx-auto h-12 w-12 text-slate-300" />
                                    <h3 className="mt-2 text-sm font-medium text-slate-800">No categories</h3>
                                    <p className="mt-1 text-sm text-slate-500">Get started by creating a new category.</p>
                                    <div className="mt-6">
                                         <button
                                            onClick={handleOpenAddModal} 
                                            className="inline-flex items-center px-4 py-2 bg-brand-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition duration-150 ease-in-out"
                                        >
                                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            New Category
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
                title={editingCategory ? 'Edit Category' : 'Add New Category'}
                size="md" 
             >
                <CategoryForm
                    categoryToEdit={editingCategory}
                    onSaveSuccess={handleSaveSuccess}
                    onCancel={handleCloseModal}
                />
             </Modal>
        </div>
    );
};

export default CategoryList;
