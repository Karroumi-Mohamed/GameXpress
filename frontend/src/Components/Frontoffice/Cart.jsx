import React, { useContext } from 'react';
import CartContext from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'; // Import icons

// Accept onClose prop
export default function Cart({ onClose }) {
    // Get new functions from context
    const { cart, updateItemQuantity, removeItemFromCart } = useContext(CartContext);

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => {
        // Ensure product and price exist before calculation
        const price = item.product?.price ?? 0;
        return sum + item.quantity * price;
    }, 0);

    return (
        <div className="flex flex-col h-full">
            {/* Cart Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900">Shopping Cart</h2>
                <button
                    type="button"
                    className="text-slate-400 hover:text-slate-500"
b                      onClick={onClose} // Call onClose when clicked
                >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                {cart.length > 0 ? (
                    <ul role="list" className="-my-6 divide-y divide-slate-200">
                        {cart.map((item) => (
                            <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                                    {/* Assuming item.product.primaryImage exists and has an image_url */}
                                    <img
                                        src={item.product?.primaryImage?.image_url || 'https://via.placeholder.com/150'} // Placeholder image
                                        alt={item.product.name}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-slate-900">
                                            <h3>
                                                <Link to={`/products/${item.product.slug}`}>{item.product.name}</Link>
                                            </h3>
                                            <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        {/* Optional: Add product variant info here if available */}
                                        {/* Optional: Add product variant info here if available */}
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        {/* Quantity Adjuster */}
                                        <div className="flex items-center border border-slate-200 rounded">
                                            <button
                                                type="button"
                                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                className="px-2 py-1 text-slate-500 hover:bg-slate-100 rounded-l disabled:opacity-50"
                                                disabled={item.quantity <= 1} // Disable minus if qty is 1
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </button>
                                            <span className="px-3 py-1 text-slate-700 border-l border-r border-slate-200">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 text-slate-500 hover:bg-slate-100 rounded-r"
                                                // Optional: Disable plus if stock limit reached (requires stock info)
                                                // disabled={item.quantity >= item.product.stock}
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="flex">
                                            <button
                                                type="button"
                                                onClick={() => removeItemFromCart(item.id)} // Call remove function
                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-slate-500">Your cart is empty.</p>
                )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
                <div className="border-t border-slate-200 px-4 py-6">
                    <div className="flex justify-between text-base font-medium text-slate-900">
                        <p>Subtotal</p>
                        <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                        <a
                            href="#" // TODO: Link to checkout page
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Checkout
                        </a>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-slate-500">
                        <p>
                            or{' '}
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={onClose}
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
