import { createContext, useEffect, useState, useMemo } from "react"; // Added useMemo
import api from "../lib/axios";

const CartContext = createContext(undefined);
const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]); // Holds the array of cart item objects

    // Calculate total item count whenever cart changes
    const cartItemCount = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const fetchCartItems = async () => {
        try {
            const res = await api.get('/cart');
            console.log("Fetching cart items...");
            console.log(res.data);
            setCart(res.data.items);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }
    const addToCart = async (item) => {
        try {
            const res = await api.post('/cart/items', { product_id: item.id, quantity: 1});
            console.log("Adding item to cart...");
            console.log(res.data);
            fetchCartItems();
        } catch (error) {
            console.error("Error adding item to cart:", error);

        }
    }

    const updateItemQuantity = async (itemId, quantity) => {
        // Prevent non-positive quantities
        if (quantity < 1) {
            removeItemFromCart(itemId); // Remove if quantity is less than 1
            return;
        }
        try {
            // Use the public PUT endpoint
            const res = await api.put(`/cart/items/${itemId}`, { quantity });
            console.log("Updating item quantity...");
            console.log(res.data);
            fetchCartItems(); // Refresh cart state
        } catch (error) {
            console.error("Error updating item quantity:", error);
            // TODO: Add user feedback (toast?)
        }
    };

    const removeItemFromCart = async (itemId) => {
        try {
            // Use the public DELETE endpoint
            const res = await api.delete(`/cart/items/${itemId}`);
            console.log("Removing item from cart...");
            console.log(res.data);
            fetchCartItems(); // Refresh cart state
        } catch (error) {
            console.error("Error removing item from cart:", error);
            // TODO: Add user feedback (toast?)
        }
    };


    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        // Provide new functions in the context value
        <CartContext.Provider value={{
            cart,
            setCart,
            addToCart,
            fetchCartItems,
            cartItemCount,
            updateItemQuantity, // Added
            removeItemFromCart  // Added
        }}>
            {children}
        </CartContext.Provider>
    )

}

export default CartContext;
export { CartProvider };
