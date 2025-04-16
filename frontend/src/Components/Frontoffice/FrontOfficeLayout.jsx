import { Link } from "react-router-dom"
import ProductListPage from "./Products/ProductListPage"
import { CartProvider } from "../../context/CartContext"
import Cart from "./Cart"

export default function FrontOfficeLayout() {

    return (
        <CartProvider>
            <div>
                <div>
                    <ProductListPage />
                </div>
                <div className="fixed top-0 right-0 p-4 bg-amber-100">
                    <Cart />
                </div>
            </div>
        </CartProvider>

    )

}