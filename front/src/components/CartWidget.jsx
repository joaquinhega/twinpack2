/*muestra un enlace a la página de solicitud de cotización. Muestra el texto "Solicitud de Cotización" y, si hay productos en el carrito, también muestra el número total de productos en el carrito sumando las cantidades.

import {useContext} from "react";
import {CartContext} from "../contexts/CartContext";
import {Link} from "react-router-dom"

const CartWidget = () => {

    const {cart} = useContext(CartContext);
    return(
        <Link to="/dashboard/cartcheckout" style={{ color: 'inherit', textDecoration: 'inherit'}} className="cartwidgetlink">
            <li className={`cartwidget`}>
                Solicitud de Cotización
                {cart.reduce((acc,prod) => acc + prod.quantity,0) !== 0 && (<div>{cart.reduce((acc,prod) => acc + prod.quantity,0)}</div>)}
            </li>
        </Link>
    )
}


export default CartWidget;*/