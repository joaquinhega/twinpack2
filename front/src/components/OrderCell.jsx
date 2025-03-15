import { useState, useContext, useRef, useEffect } from "react";

const OrderCell = ({ id, fecha, usuario, cliente, proveedor, observaciones, recibida, ordersEdited, setOrdersEdited }) => {
    const [recibidaToFetch, setRecibidaToFetch] = useState(recibida);
    const isFirstRenderOrder = useRef(true);
    const changeRecibida = function(event) {
        setRecibidaToFetch(event.target.checked ? "1" : "0");
    }

    function EditOrder() {
        let edited_order = {
            id: id,
            cliente: cliente,
            proveedor: proveedor,
            recibida: recibidaToFetch
        };
        let orders = [...ordersEdited];
        let orderIndex = orders.findIndex(order => order.id === id);

        if (orderIndex !== -1) {
            orders[orderIndex] = edited_order;
        } else {
            orders.push(edited_order);
        }
        setOrdersEdited(orders);
    }

    useEffect(() => {
        if (isFirstRenderOrder.current) {
            isFirstRenderOrder.current = false;
            return;
        }
        EditOrder();
    }, [recibidaToFetch]);

    return (
        <tr>
            <td>{id}</td>
            <td>{fecha}</td>
            <td>{usuario}</td>
            <td>{cliente}</td>
            <td>{proveedor}</td>
            <td>{observaciones}</td>
            <td>
                <div className="div_input">
                    <label className="switch">
                        <input type="checkbox" checked={parseInt(recibidaToFetch)} onChange={changeRecibida}></input>
                        <span className="slider round"></span>
                    </label>
                </div>
            </td>
        </tr>
    );
};

export default OrderCell;