
import {createContext,useState, useContext} from "react";
import {CounterContext} from "./CounterContext";


export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cart,setCart] = useState([]);

    const {counter,setCounter} = useContext(CounterContext)

    // I'm going to add different methods that will be definitely useful for interacting with the cart :D

    // Voy a añadir diferentes métodos que definitivamente serán útiles para la interacción con el carrito ^-^


    const clearCart = () => {
        setCounter(0);
        setCart([]);
    }


    const addProductToCart = (product,quantity) => {
        let newCart = cart.filter((prod) => prod.quantity > 0).map((prod) => {
            if (product.id === prod.id) {
                prod.quantity = quantity;
            }
            return prod;
        });
        if (!newCart.some((prod) => prod.id === product.id)) {
            newCart.push({
                ...product,
                quantity: quantity
            });
        }
        setCart(newCart);
    }

    const deleteProductFromCart = (id,quantity) => {
        setCart(cart.filter(prod => prod.id !== id))
        setCounter(amountOfProductsCart() - quantity)
    }

    const amountOfProductsCart = () => {
        return cart.reduce((acc,prod) => acc + prod.quantity,0)
    }

    const getTotalPrice = () => {
        let totalPrice = 0;

        for(let product of cart){
            totalPrice += product.totalForItem;
        }
        console.log(totalPrice)

        return totalPrice;
    }


    return(
        <CartContext.Provider value={{cart,setCart,addProductToCart,getTotalPrice,clearCart,deleteProductFromCart,amountOfProductsCart}}>
            {children}
        </CartContext.Provider>
    );
};