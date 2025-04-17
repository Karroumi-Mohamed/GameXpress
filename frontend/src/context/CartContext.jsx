import { createContext, useEffect, useState } from "react";
import api from "../lib/axios";

const CartContext = createContext(undefined);
const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const fetchCartItems = async () => {
        try {
            const res = await api.get('/client/cart');
            console.log("Fetching cart items...");
            console.log(res.data);
            setCart(res.data.items);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }
    const addToCart = async (item) => {
        try {
            const res = await api.post('/client/cart/items', { product_id: item.id, quantity: 1});
            console.log("Adding item to cart...");
            console.log(res.data);
            fetchCartItems();
        } catch (error) {
            console.error("Error adding item to cart:", error);

        }
        // setCart((prevCart) => {
        //     if (prevCart) {
        //         return prevCart.find((cartItem) => cartItem.id === item.id) ? prevCart.map((cartItem) => {
        //             if (cartItem.id === item.id) {
        //                 return { ...cartItem, quantity: cartItem.quantity + 1 };
        //             }
        //             return cartItem;
        //         }) : [...prevCart, { ...item, quantity: 1 }];
        //     } else {
        //         return [{ ...item, quantity: 1}];
        //     }
        // });
    }

    useEffect(() => {
        fetchCartItems();
    }, []);
    
    return (
        <CartContext.Provider value={{ cart, setCart, addToCart }}>
            {children}
        </CartContext.Provider>
    )

}

export default CartContext;
export { CartProvider };
