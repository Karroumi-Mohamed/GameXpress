import React, { useState, useContext } from 'react';
import { Link, Outlet } from "react-router-dom"; // Import Outlet
import ProductListPage from "./Products/ProductListPage"; // Keep for default content if needed
import { CartProvider } from "../../context/CartContext";
import CartContext from '../../context/CartContext'; // Import context itself
import Cart from "./Cart";
import { ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// Main Layout Component - Renders Header, Footer (optional), Cart Panel, and Page Content (via Outlet)
const LayoutComponent = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartItemCount } = useContext(CartContext); // Get item count from context

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col"> {/* Changed background, added flex-col */}
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex flex-shrink-0 items-center">
                            <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                GameXpress
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                            <div className="flex h-full space-x-8">
                                <Link to="/" className="flex items-center text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Home</Link>
                                <Link to="/products" className="flex items-center text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Products</Link>
                                {/* Add more links */}
                            </div>
                        </div>

                        <div className="ml-auto flex items-center">
                            {/* Desktop Auth Links */}
                            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                {/* TODO: Conditionally show Sign out based on auth status */}
                                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Sign in</Link>
                                <span className="h-6 w-px bg-slate-200" aria-hidden="true" />
                                <Link to="/register" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Create account</Link>
                            </div>

                            {/* Cart Button */}
                            <div className="ml-4 flow-root lg:ml-6">
                                <button onClick={toggleCart} className="group -m-2 flex items-center p-2 relative">
                                    <ShoppingBagIcon
                                        className="h-6 w-6 flex-shrink-0 text-slate-400 group-hover:text-slate-500 transition-colors"
                                        aria-hidden="true"
                                    />
                                    {cartItemCount > 0 && (
                                         <span className="absolute -top-1 -right-1 ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{cartItemCount}</span>
                                    )}
                                    <span className="sr-only">items in cart, view bag</span>
                                </button>
                            </div>

                            {/* Mobile menu button */}
                            <div className="ml-4 flex lg:hidden">
                                <button
                                    type="button"
                                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                    onClick={toggleMobileMenu}
                                >
                                    <span className="sr-only">Open menu</span>
                                    {isMobileMenuOpen ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile menu Panel */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                             <Link to="/" onClick={toggleMobileMenu} className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Home</Link>
                             <Link to="/products" onClick={toggleMobileMenu} className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Products</Link>
                             {/* Add more mobile links */}
                        </div>
                        <div className="border-t border-slate-200 pb-3 pt-4">
                             {/* TODO: Conditionally show profile/logout based on auth status */}
                            <div className="space-y-1 px-2">
                                <Link to="/login" onClick={toggleMobileMenu} className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Sign in</Link>
                                <Link to="/register" onClick={toggleMobileMenu} className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Create account</Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            {/* Use Outlet to render child routes defined in App.jsx */}
            <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
                {/* Default content if no route matches */}
                <ProductListPage />
            </main>

             {/* Footer (Optional) */}
             <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
                    &copy; {new Date().getFullYear()} GameXpress. All rights reserved.
                </div>
            </footer>


            {/* Slide-out Cart Panel */}
            {/* Overlay */}
             {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-40"
                    onClick={closeCart}
                    aria-hidden="true"
                 />
             )}
            <div
                className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transform transition duration-300 ease-in-out ${
                    isCartOpen ? 'translate-x-0' : 'translate-x-full'
                } z-50`} // Increased z-index
                aria-labelledby="slide-over-title"
            >
                <div className="w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <Cart onClose={closeCart} />
                    </div>
                </div>
            </div>

        </div>
    );
}

// Wrap LayoutComponent with CartProvider
export default function FrontOfficeLayout() {
    return (
        <CartProvider>
            <LayoutComponent />
        </CartProvider>
    );
}
