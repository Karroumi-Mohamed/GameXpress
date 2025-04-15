import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { Link } from 'react-router-dom';
import { CubeIcon } from '@heroicons/react/24/outline';

interface ProductImage {
    id: number;
    image_url: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: ProductImage[];
}

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getPrimaryImageUrl = (images: ProductImage[]): string | null => {
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

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get<{ data: Product[] }>('/products');
                setProducts(response.data.data || response.data || []);
            } catch (err: any) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return <div className="container mx-auto px-4 py-16 text-center">Loading products...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-16 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-indigo-600">GameXpress</Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Products</h1>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => {
                            const imageUrl = getPrimaryImageUrl(product.images);
                            return (
                                <Link key={product.id} to={`/products/${product.slug}`} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="h-48 w-full overflow-hidden">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <CubeIcon className="h-16 w-16" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-200">{product.name}</h2>
                                        <p className="text-xl font-bold text-indigo-600 mt-3">${product.price?.toFixed(2)}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <CubeIcon className="mx-auto h-16 w-16 text-gray-300" />
                        <h3 className="mt-2 text-lg font-medium text-gray-800">No products available</h3>
                        <p className="mt-1 text-sm text-gray-500">Please check back later.</p>
                    </div>
                )}
            </div>

             <footer className="bg-gray-800 text-white mt-16 py-8">
                <div className="container mx-auto px-4 text-center text-sm">
                    &copy; {new Date().getFullYear()} GameXpress. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default ProductListPage;
