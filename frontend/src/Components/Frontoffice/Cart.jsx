import React, { useContext } from 'react'
import CartContext from '../../context/CartContext';
import { Link } from 'react-router-dom';



export default function Cart() {
    const { cart, setCart, addToCart } = useContext(CartContext);
    console.log(cart);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Cart</h1>
            {cart.length > 0 && cart.map((product) => {
                return (
                    <Link key={product.id} to={`/products/${product.slug}`} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-200">{product.name} x {product.quantity}</h2>
                            <p className="text-xl font-bold text-indigo-600 mt-3">${product.price}</p>
                        </div>

                    </Link>
                );
            })}
        </div>
    )
}
