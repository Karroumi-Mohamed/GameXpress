import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/axios.js';
import { toast } from 'react-toastify';
import { CheckIcon, XMarkIcon, PhotoIcon, TrashIcon, StarIcon as StarSolidIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import * as Yup from 'yup';


const ProductForm = ({ productToEdit, onSaveSuccess, onCancel }) => {
    const isEditing = Boolean(productToEdit);
    const [formData, setFormData] = useState({
        name: productToEdit?.name || '',
        description: productToEdit?.description || '',
        price: productToEdit?.price?.toString() || '',
        stock: productToEdit?.stock?.toString() || '',
        category_id: productToEdit?.category?.id?.toString() || '',
        subcategory_id: productToEdit?.subcategory?.id?.toString() || '',
        status: productToEdit?.status || '',
        critical_stock_threshold: productToEdit?.critical_stock_threshold?.toString() || '5',
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategorySubcategories, setSelectedCategorySubcategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [errors, setErrors] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImages, setExistingImages] = useState(productToEdit?.images || []);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/admin/categories?includeSubcategories=true');
                setCategories(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch categories for form:", err);
                toast.error("Could not load categories.");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (formData.category_id) {
            const selectedCat = categories.find(cat => cat.id.toString() === formData.category_id);
            setSelectedCategorySubcategories(selectedCat?.subcategories || []);
        } else {
            setSelectedCategorySubcategories([]);
        }
        if (!isEditing || productToEdit?.category?.id.toString() !== formData.category_id) {
             setFormData(prev => ({ ...prev, subcategory_id: '' }));
        }
    }, [formData.category_id, categories, isEditing, productToEdit]);

     useEffect(() => {
        setFormData({
            name: productToEdit?.name || '',
            description: productToEdit?.description || '',
            price: productToEdit?.price?.toString() || '',
            stock: productToEdit?.stock?.toString() || '',
            category_id: productToEdit?.category?.id?.toString() || '',
            subcategory_id: productToEdit?.subcategory?.id?.toString() || '',
            status: productToEdit?.status || '',
            critical_stock_threshold: productToEdit?.critical_stock_threshold?.toString() || '5',
        });
        setExistingImages(productToEdit?.images || []);
        setImageFiles([]);
        setErrors({});
        setFormErrors({});
        setActiveTab('general');
    }, [productToEdit]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onDrop = useCallback((acceptedFiles) => {
        const filesWithPreview = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setImageFiles(prev => [...prev, ...filesWithPreview]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
        multiple: true
    });

    useEffect(() => {
        return () => imageFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }, [imageFiles]);

    const removeNewImage = (index) => {
        const fileToRemove = imageFiles[index];
        URL.revokeObjectURL(fileToRemove.preview);
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (imageId) => {
        if (!productToEdit || !window.confirm('Are you sure you want to delete this image?')) return;
        console.log(`Calling API DELETE /admin/products/${productToEdit.id}/images/${imageId}`);
        try {
            await api.delete(`/admin/products/${productToEdit.id}/images/${imageId}`);
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
            toast.success('Image deleted successfully.');
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Failed to delete image.';
            toast.error(errMsg);
            console.error("Image deletion error:", err);
        }
    };

    const setPrimaryImage = async (imageId) => {
         if (!productToEdit) return;
         console.log(`Calling API PUT /admin/products/${productToEdit.id}/images/${imageId}/set-primary`);
         try {
            await api.put(`/admin/products/${productToEdit.id}/images/${imageId}/set-primary`);
            setExistingImages(prev => prev.map(img => ({ ...img, is_primary: img.id === imageId })));
            toast.success('Primary image updated successfully.');
         } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Failed to set primary image.';
            toast.error(errMsg);
            console.error("Set primary image error:", err);
         }
    };

    const handleImageUpload = async () => {
        if (!productToEdit || imageFiles.length === 0) return;

        setIsUploadingImages(true);
        const imageFormData = new FormData();
        imageFiles.forEach(file => imageFormData.append('images[]', file));

        try {
            const response = await api.post(`/admin/products/${productToEdit.id}/images`, imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setExistingImages(response.data.images || []);
            setImageFiles([]);
            toast.success(response.data.message || 'Images uploaded successfully!');
        } catch (imgErr) {
             console.error("Failed to upload images:", imgErr);
             const imgErrMsg = imgErr.response?.data?.message || imgErr.message || "Failed to upload new images.";
             toast.error(`Image upload failed: ${imgErrMsg}`);
        } finally {
            setIsUploadingImages(false);
        }
    };

    const productSchema = Yup.object().shape({
        name: Yup.string().required('Product name is required').min(3, 'Name must be at least 3 characters'),
        description: Yup.string().optional(),
        price: Yup.number()
            .required('Price is required')
            .typeError('Price must be a valid number')
            .positive('Price must be positive'),
        stock: Yup.number()
            .required('Stock quantity is required')
            .typeError('Stock must be a valid number')
            .integer('Stock must be a whole number')
            .min(0, 'Stock cannot be negative'),
        critical_stock_threshold: Yup.number()
            .required('Critical stock threshold is required')
            .typeError('Threshold must be a valid number')
            .integer('Threshold must be a whole number')
            .min(0, 'Threshold cannot be negative'),
        category_id: Yup.string().required('Category is required'),
        subcategory_id: Yup.string().optional(),
        status: Yup.string().oneOf(['available', 'unavailable'], 'Invalid status').required('Status is required'),
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors({});
        setFormErrors({});

        try {
            await productSchema.validate(
                {
                    ...formData,
                    price: formData.price ? parseFloat(formData.price) : undefined,
                    stock: formData.stock ? parseInt(formData.stock, 10) : undefined,
                    critical_stock_threshold: formData.critical_stock_threshold ? parseInt(formData.critical_stock_threshold, 10) : undefined,
                },
                { abortEarly: false }
            );
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
            if (yupErrors.name || yupErrors.description || yupErrors.category_id || yupErrors.subcategory_id || yupErrors.status) {
                setActiveTab('general');
            } else if (yupErrors.price || yupErrors.stock || yupErrors.critical_stock_threshold) {
                setActiveTab('pricing');
            }
            return;
        }

        const apiData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            stock: parseInt(formData.stock, 10) || 0,
            category_id: parseInt(formData.category_id, 10),
            status: formData.status,
            critical_stock_threshold: parseInt(formData.critical_stock_threshold, 10) || 0,
            ...(formData.subcategory_id && { sub_category_id: parseInt(formData.subcategory_id, 10) })
        };
        delete apiData.subcategory_id; // Remove the original key

        try {
            if (isEditing && productToEdit) {
                await api.put(`/admin/products/${productToEdit.id}`, apiData);
                toast.success('Product details updated successfully!');
            } else {
                await api.post('/admin/products', apiData);
                toast.success('Product created successfully! Please edit the product to add images.');
            }
            onSaveSuccess();
        } catch (err) {
            console.error("Failed to save product:", err);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
                toast.error('Validation failed. Please check the form fields.');
                const apiFieldErrors = err.response.data.errors;
                if (apiFieldErrors.name || apiFieldErrors.description || apiFieldErrors.category_id || apiFieldErrors.subcategory_id || apiFieldErrors.status) {
                    setActiveTab('general');
                } else if (apiFieldErrors.price || apiFieldErrors.stock || apiFieldErrors.critical_stock_threshold) {
                    setActiveTab('pricing');
                }
            } else {
                const errorMessage = err.response?.data?.message || err.message || "Failed to save product.";
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const hasError = (fieldName) => Boolean(errors[fieldName] || formErrors[fieldName]);

    const inputClass = (fieldName) =>
        `block w-full px-4 py-2 text-slate-900 border ${hasError(fieldName) ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 ${hasError(fieldName) ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm transition duration-150 ease-in-out`;

    const selectClass = (fieldName) =>
        `block w-full pl-3 pr-10 py-2 text-base border ${hasError(fieldName) ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm transition duration-150 ease-in-out`;

    const displayError = (fieldName) => {
        const errorMsg = formErrors[fieldName] || errors[fieldName]?.[0];
        return errorMsg ? <p className="mt-1 text-xs text-red-600">{errorMsg}</p> : null;
    };

    const renderGeneralTab = () => (
        <div className="space-y-5 pt-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={inputClass('name')} placeholder="e.g., Super Game X" required />
                {displayError('name')}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} className={inputClass('description')} placeholder="Detailed description of the product..." />
                {displayError('description')}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select name="category_id" id="category_id" value={formData.category_id} onChange={handleInputChange} className={selectClass('category_id')} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {displayError('category_id')}
                </div>
                <div>
                    <label htmlFor="subcategory_id" className="block text-sm font-medium text-slate-700 mb-1">Subcategory (Optional)</label>
                    <select name="subcategory_id" id="subcategory_id" value={formData.subcategory_id} onChange={handleInputChange} className={selectClass('subcategory_id')} disabled={selectedCategorySubcategories.length === 0}>
                        <option value="">{selectedCategorySubcategories.length === 0 ? 'No subcategories available' : 'Select Subcategory'}</option>
                        {selectedCategorySubcategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                    {displayError('subcategory_id')}
                </div>
            </div>
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleInputChange} className={selectClass('status')} required>
                    <option value="" disabled>Select Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>
                {displayError('status')}
            </div>
        </div>
    );

    const renderPricingTab = () => (
         <div className="space-y-5 pt-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} className={inputClass('price')} placeholder="0.00" step="0.01" min="0" required />
                     {displayError('price')}
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                    <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleInputChange} className={inputClass('stock')} placeholder="0" step="1" min="0" required />
                    {displayError('stock')}
                </div>
            </div>
             <div>
                <label htmlFor="critical_stock_threshold" className="block text-sm font-medium text-slate-700 mb-1">Critical Stock Threshold</label>
                <input
                    type="number"
                    name="critical_stock_threshold"
                    id="critical_stock_threshold"
                    value={formData.critical_stock_threshold}
                    onChange={handleInputChange}
                    className={inputClass('critical_stock_threshold')}
                    placeholder="e.g., 5"
                    step="1"
                    min="0"
                    required
                />
                {displayError('critical_stock_threshold')}
                <p className="mt-1 text-xs text-slate-500">Receive notification when stock reaches this level.</p>
            </div>
        </div>
    );

     const renderImagesTab = () => (
         <div className="pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Images</label>
            <div
                {...getRootProps()}
                className={`mt-1 p-6 border-2 ${isDragActive ? 'border-indigo-600' : 'border-slate-300'} border-dashed rounded-lg text-center cursor-pointer hover:border-indigo-400 bg-slate-50/50 transition-colors duration-200 ease-in-out`}
            >
                <input {...getInputProps()} />
                <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">
                    {isDragActive ? 'Drop the files here ...' : 'Drag \'n\' drop image files here, or click to select'}
                </p>
                <p className="text-xs text-slate-500">PNG, JPG, GIF, WEBP accepted</p>
            </div>

            {existingImages.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-600 mb-2">Current Images:</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {existingImages.map((image) => {
                                    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
                                    const imageUrl = image.image_url.startsWith('http') ? image.image_url : `${backendUrl}/storage/${image.image_url.replace(/^\/+/, '')}`;
                                    return (
                                        <div key={image.id} className="relative group border rounded-md overflow-hidden shadow-sm">
                                            <img src={imageUrl} alt={`Product image ${image.id}`} className="h-24 w-full object-cover" />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setPrimaryImage(image.id)}
                                                    title={image.is_primary ? "Primary Image" : "Set as Primary"}
                                                    className={`p-1 rounded-full ${image.is_primary ? 'bg-yellow-400 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'}`}
                                                >
                                                    {image.is_primary ? <StarSolidIcon className="h-4 w-4" /> : <StarOutlineIcon className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(image.id)}
                                                    title="Delete Image"
                                                    className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {image.is_primary && (
                                                 <div className="absolute top-1 right-1 bg-yellow-400 text-white p-0.5 rounded-full">
                                                    <StarSolidIcon className="h-3 w-3" />
                                                 </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                </div>
            )}

            {imageFiles.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-600 mb-2">New Images to Upload:</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {imageFiles.map((file, index) => (
                            <div key={file.path || index} className="relative group border rounded-md overflow-hidden shadow-sm">
                                <img src={file.preview} alt={`Preview ${file.name}`} className="h-24 w-full object-cover" onLoad={() => URL.revokeObjectURL(file.preview)} />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center">
                                     <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        title="Remove Image"
                                        className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                     {isEditing && imageFiles.length > 0 && (
                         <div className="mt-4 text-right">
                             <button
                                 type="button"
                                 onClick={handleImageUpload}
                                 disabled={isUploadingImages || isLoading}
                                 className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                             >
                                 <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                                 {isUploadingImages ? 'Uploading...' : `Upload ${imageFiles.length} New Image(s)`}
                             </button>
                         </div>
                     )}
                </div>
            )}
        </div>
     );

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6 border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'general'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        General Info
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('pricing')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'pricing'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        Pricing & Stock
                    </button>
                     <button
                        type="button"
                        onClick={() => setActiveTab('images')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'images'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        Images
                    </button>
                </nav>
            </div>

            <div className="min-h-[300px]">
                {activeTab === 'general' && renderGeneralTab()}
                {activeTab === 'pricing' && renderPricingTab()}
                {activeTab === 'images' && renderImagesTab()}
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
                        disabled={isLoading || isUploadingImages}
                        className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
