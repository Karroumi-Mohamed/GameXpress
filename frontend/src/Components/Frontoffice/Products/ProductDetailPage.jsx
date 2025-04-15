import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios.js';
import { useParams, Link } from 'react-router-dom';
import { CubeIcon, ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';


const ProductDetailPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const getFullImageUrl = (imageUrlPath) => {
        if (!imageUrlPath) return null;
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
        if (imageUrlPath.startsWith('http')) {
            return imageUrlPath;
        }
        return `${backendUrl}/storage/${imageUrlPath.replace(/^\/+/, '')}`;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) {
                setError("Product slug not found in URL.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get(`/products/${slug}`);
                const fetchedProduct = response.data.data || response.data;
                setProduct(fetchedProduct);
                const primaryImage = fetchedProduct.images?.find((img) => img.is_primary);
                const firstImage = fetchedProduct.images?.[0];
                setSelectedImage(getFullImageUrl(primaryImage?.image_url || firstImage?.image_url));

            } catch (err) {
                console.error("Failed to fetch product:", err);
                if (err.response?.status === 404) {
                    setError("Product not found.");
                } else {
                    setError("Failed to load product details. Please try again later.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleThumbnailClick = (image) => {
        setSelectedImage(getFullImageUrl(image.image_url));
    };

    const handleAddToCart = () => {
        if (!product) return;
        console.log(`TODO: Add product ${product.id} to cart`);
        alert(`Added ${product.name} to cart (implementation pending).`);
    };


    if (isLoading) {
        return <div className="container mx-auto px-4 py-16 text-center">Loading product details...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-16 text-center text-red-600">Error: {error}</div>;
    }

    if (!product) {
         return <div className="container mx-auto px-4 py-16 text-center text-gray-500">Product data not available.</div>;
    }

    return (
        <div className="bg-white min-h-screen">
             <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-indigo-600">GameXpress</Link>
                    <Link to="/products" className="text-sm text-gray-600 hover:text-indigo-600 flex items-center">
                       <ArrowLeftIcon className="h-4 w-4 mr-1"/> Back to Products
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 shadow">
                             {selectedImage ? (
                                <img src={selectedImage} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    <CubeIcon className="h-24 w-24" />
                                </div>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {product.images.map((image) => {
                                    const thumbUrl = getFullImageUrl(image.image_url);
                                    return thumbUrl ? (
                                        <button
                                            key={image.id}
                                            onClick={() => handleThumbnailClick(image)}
                                            className={`flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border-2 transition-colors duration-200 ${selectedImage === thumbUrl ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'}`}
                                        >
                                            <img src={thumbUrl} alt={`Thumbnail ${image.id}`} className="h-full w-full object-cover" />
                                        </button>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <nav className="text-sm mb-2">
                            <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
                            <span className="mx-2 text-gray-400">/</span>
                            <span className="text-gray-700">{product.name}</span>
                        </nav>

                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
                        <p className="text-3xl font-semibold text-indigo-600 mb-4">${product.price?.toFixed(2)}</p>

                         <div className="mb-6">
                            {product.status === 'available' && product.stock > 0 ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.status !== 'available' || product.stock <= 0}
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            <ShoppingCartIcon className="h-5 w-5 mr-2"/>
                            Add to Cart
                        </button>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
                            <div className="prose prose-sm max-w-none text-gray-600">
                                {product.description || 'No description available.'}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

             <footer className="bg-gray-100 text-gray-600 mt-16 py-8">
                <div className="container mx-auto px-4 text-center text-sm">
                    &copy; {new Date().getFullYear()} GameXpress. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default ProductDetailPage;
