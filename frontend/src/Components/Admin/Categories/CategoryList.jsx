import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios.js';
import { toast } from 'react-toastify';
import { TagIcon, PlusIcon, PencilSquareIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Modal from '../../Common/Modal.jsx'; 
import CategoryForm from './CategoryForm.jsx';
import SubcategoryForm from './SubcategoryForm.jsx';


const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSabcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({}); 

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/categories');
            setCategories(response.data.data || []);
        } catch (err) {
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

    const handleOpenEditModal = (category) => {
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

    const handleSubcategorySaveSuccess = () => {
        handleCloseSubcategoryModal();
        fetchCategories();
    };
    
    const toggleExpandCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleOpenAddSubcategoryModal = (categoryId) => {
        setCurrentCategoryId(categoryId);
        setEditingSubcategory(null);
        setIsSubcategoryModalOpen(true);
    };

    const handleOpenEditSubcategoryModal = (categoryId, subcategory) => {
        setCurrentCategoryId(categoryId);
        setEditingSubcategory(subcategory);
        setIsSubcategoryModalOpen(true);
    };

    const handleCloseSubcategoryModal = () => {
        setIsSubcategoryModalOpen(false);
        setEditingSubcategory(null);
        setCurrentCategoryId(null);
    };

    const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
        if (!window.confirm('Are you sure you want to delete this subcategory? This might affect associated products.')) {
            return;
        }
        try {
            await api.delete(`/admin/categories/${categoryId}/subcategories/${subcategoryId}`);
            toast.success('Subcategory deleted successfully!');
            fetchCategories(); // Refresh the list
        } catch (err) {
            console.error("Failed to delete subcategory:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to delete subcategory.";
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? This might affect associated products.')) {
            return;
        }
        try {
            await api.delete(`/admin/categories/${id}`);
            toast.success('Category deleted successfully!');
            fetchCategories(); // Refresh the list
        } catch (err) {
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
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
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
                            <React.Fragment key={category.id}>
                                <tr className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                                    <td className="px-3 py-4">
                                        {(category.subcategories ?? category.subCategories ?? category.sub_categories ?? []).length > 0 && (
                                            <button
                                                onClick={() => toggleExpandCategory(category.id)}
                                                className="p-1 rounded-full hover:bg-indigo-100"
                                            >
                                                {expandedCategories[category.id] ? (
                                                    <ChevronUpIcon className="h-5 w-5 text-indigo-600" />
                                                ) : (
                                                    <ChevronDownIcon className="h-5 w-5 text-indigo-600" />
                                                )}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-900">{category.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{category.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center space-x-1">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {category.subcategories?.length || category.subCategories?.length || category.sub_categories?.length || 0}
                                            </span>
                                            <button 
                                                onClick={() => handleOpenAddSubcategoryModal(category.id)}
                                                className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                title="Add subcategory"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </button>
                                        </div>
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

                                {/* Subcategories expandable row */}
                                {expandedCategories[category.id] && (
                                    <tr className="bg-slate-50/50">
                                        <td colSpan={7} className="px-4 py-3">
                                            <div className="shadow-sm rounded-lg overflow-hidden border border-slate-200">
                                                <table className="min-w-full divide-y divide-slate-100">
                                                    <thead className="bg-indigo-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subcategory Name</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                                                            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</th>
                                                            <th scope="col" className="relative px-6 py-3">
                                                                <span className="sr-only">Actions</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-slate-100">
                                                        {(category.subcategories || category.subCategories || category.sub_categories || []).filter(Boolean).map((subcategory) => (
                                                            <tr key={subcategory.id} className="hover:bg-indigo-50/30">
                                                                <td className="px-6 py-3 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-slate-900">{subcategory.name}</div>
                                                                </td>
                                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500 font-mono">{subcategory.slug}</td>
                                                                <td className="px-6 py-3 whitespace-nowrap text-center">
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        {subcategory.products_count || 0}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                                                    <button
                                                                        onClick={() => handleOpenEditSubcategoryModal(category.id, subcategory)}
                                                                        title="Edit Subcategory"
                                                                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center p-1.5 hover:bg-indigo-100 rounded-lg"
                                                                    >
                                                                        <PencilSquareIcon className="h-4 w-4" />
                                                                        <span className="sr-only">Edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                                                        title="Delete Subcategory"
                                                                        className="text-red-600 hover:text-red-800 inline-flex items-center p-1.5 hover:bg-red-100 rounded-lg"
                                                                    >
                                                                        <TrashIcon className="h-4 w-4" />
                                                                        <span className="sr-only">Delete</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
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

             <Modal
                isOpen={isSabcategoryModalOpen}
                onClose={handleCloseSubcategoryModal}
                title={editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
                size="md" 
             >
                <SubcategoryForm
                    categoryId={currentCategoryId || 0}
                    subcategoryToEdit={editingSubcategory}
                    onSaveSuccess={handleSubcategorySaveSuccess}
                    onCancel={handleCloseSubcategoryModal}
                />
             </Modal>
        </div>
    );
};

export default CategoryList;
