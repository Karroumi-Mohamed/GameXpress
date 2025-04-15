import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios.js';
import { toast } from 'react-toastify';
import { CubeIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../Common/Modal.jsx';
import ProductForm from './ProductForm.jsx';


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data.data || response.data || []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to load products. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveSuccess = () => {
        handleCloseModal();
        fetchProducts();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        try {
            await api.delete(`/admin/products/${id}`);
            toast.success('Product deleted successfully!');
            fetchProducts();
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    const getPrimaryImageUrl = (images) => {
        const primary = images?.find(img => img.is_primary);
        const firstImage = images?.[0];
        const imageUrlPath = primary?.image_url || firstImage?.image_url;

        if (!imageUrlPath) return null;

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
        if (imageUrlPath.startsWith('http')) {
            return imageUrlPath;
        }
        return `${backendUrl}/storage/${imageUrlPath.replace(/^\/+/, '')}`;
    };


    if (isLoading) {
        return <div className="p-8 text-center">Loading products...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600 text-center">Error loading products: {error}</div>;
    }

    return (
        <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                    <CubeIcon className="h-8 w-8 mr-3 text-accent-500" />
                    Manage Products
                </h1>
                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/75">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subcategory</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                            <th scope="col" className="relative px-6 py-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {products.length > 0 ? products.map((product) => {
                            const imageUrl = getPrimaryImageUrl(product.images);
                            return (
                                <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-md bg-slate-200 flex items-center justify-center text-slate-400">
                                                <CubeIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{product.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{product.category?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.subcategory?.name || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 text-right font-medium">
                                        ${product.price?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            product.stock > 10 ? 'bg-green-100 text-green-800' :
                                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                            product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date(product.created_at).toLocaleDateString('en-CA')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                        <button
                                            onClick={() => handleOpenEditModal(product)}
                                            title="Edit Product"
                                            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center p-1.5 hover:bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                            <span className="sr-only">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            title="Delete Product"
                                            className="text-red-600 hover:text-red-800 inline-flex items-center p-1.5 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                            <span className="sr-only">Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-16 text-center">
                                    <CubeIcon className="mx-auto h-12 w-12 text-slate-300" />
                                    <h3 className="mt-2 text-sm font-medium text-slate-800">No products found</h3>
                                    <p className="mt-1 text-sm text-slate-500">Get started by adding a new product.</p>
                                    <div className="mt-6">
                                        <button
                                            onClick={handleOpenAddModal}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                        >
                                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            New Product
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}</tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                size="xl"
             >
                <ProductForm
                    productToEdit={editingProduct}
                    onSaveSuccess={handleSaveSuccess}
                    onCancel={handleCloseModal}
                />
             </Modal>
        </div>
    );
};

export default ProductList;
