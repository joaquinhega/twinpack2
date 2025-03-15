// Tabla de ordenes NO recibidas. Nuevas Solicitudes. Pantalla principal de cotizaciones
import React, { useState, useEffect , useRef} from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import OrderDetailModal from "./OrderDetailModal";
import {FaList} from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const OrdersAdmin = () => {
    const [orderToFetch, setOrderToFetch] = useState([]);
    const [ordersEdited, setOrdersEdited] = useState([]);
    const [setOtherToFetch] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const itemsPerPage = 10;
    let history = useHistory();
    const isMounted = useRef(false);

    function traerOrders() {
        let itemsArray;
        var xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function() {
            if (xmlhttp1.readyState === 4 && xmlhttp1.status === 200) {
                let respuesta1 = xmlhttp1.responseText;
                if (respuesta1 === "Debe iniciar Sesion") {
                    history.push("/");
                }
                try {
                    itemsArray = JSON.parse(respuesta1);
                    if (Array.isArray(itemsArray)) {
                        setOrderToFetch(itemsArray);
                    } else {
                        console.error("Expected an array but got:", itemsArray);
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    console.error("Response received:", respuesta1);
                }
            }
        };
        var cadenaParametros = "Search=&Filter=&Sort=id&SelectedPage=1";
        xmlhttp1.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_solicitudes_nuevas.php', true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
        return itemsArray;
    }

    function traerOthers() {
        let itemsArray;
        var xmlhttp2 = new XMLHttpRequest();
        xmlhttp2.onreadystatechange = function() {
            if (xmlhttp2.readyState === 4 && xmlhttp2.status === 200) {
                let respuesta2 = xmlhttp2.responseText;
                if (respuesta2 === "Debe iniciar Sesion") {
                    history.push("/");
                }
                try {
                    itemsArray = JSON.parse(respuesta2);
                    if (Array.isArray(itemsArray)) {
                        setOtherToFetch(itemsArray);
                    } else {
                        console.error("Expected an array but got:", itemsArray);
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    console.error("Response received:", respuesta2);
                }
            }
        };
        var cadenaParametros = "";
        xmlhttp2.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_terceros.php', true);
        xmlhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp2.send(cadenaParametros);
        return itemsArray;
    }

    useEffect(() => {
        isMounted.current = true;
        traerOrders();
        traerOthers();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const guardarOrdenes = (e) => {
        e.preventDefault();
        if (ordersEdited.length === 0) {
            toast.error("No hay cambios para guardar.");
            return;
        }

        const formData = new FormData();
        formData.append("Ordenes", JSON.stringify(ordersEdited));
        axios
            .post("https://twinpack.com.ar/sistema/php/recibir_solicitudes.php", formData)
            .then((res) => {
                if (res.data === "Debe iniciar Sesion") {
                    history.push("/");
                }
                toast.success("Órdenes guardadas correctamente");
                traerOrders(); 
            })
            .catch((err) => {
                console.error("Error al guardar las órdenes:", err);
                toast.error("Error!");
            });
    };

    const handleNewRequest = () => {
        history.push("/dashboard/newquotation");
    };

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };
    const handleEditOrder = (orderId) => {
        setSelectedOrder(orderId);
        history.push(`/dashboard/editquotation/${orderId}`);
    };
    
    const handleDeleteOrder = async (orderId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta orden?");
        if (confirmDelete) {
            try {
                const response = await axios.post(
                    'https://twinpack.com.ar/sistema/php/eliminar_orden.php',
                    new URLSearchParams({ id: orderId })
                );
                if (response.data.status === "success") {
                    if (isMounted.current) {
                        traerOrders(); 
                        toast.success(`Orden ${response.data.ordenId} eliminada correctamente`);
                    }
                } else {
                    console.error("Error al eliminar la orden:", response.data.errorInfo);
                    toast.error("Error al eliminar la orden");
                }
            } catch (error) {
                console.error("Error al eliminar la orden:", error);
                toast.error("Error al eliminar la orden");
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleToggleRecibida = (orderId) => {
        setOrdersEdited((prevOrders) => {
            const updatedOrders = prevOrders.map((order) =>
                order.id === orderId ? { ...order, recibida: !order.recibida } : order
            );
            if (!updatedOrders.find((order) => order.id === orderId)) {
                const orderToEdit = orderToFetch.find((order) => order.id === orderId);
                updatedOrders.push({ ...orderToEdit, recibida: !orderToEdit.recibida });
            }
            return updatedOrders;
        });
    };

    const paginatedOrders = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return orderToFetch.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <section>
            <div className="container">
                <div className="div_center" style={{marginTop: "60px"}}>
                    <button className="searchbar_form_submit" onClick={handleNewRequest}>
                        Nueva Solicitud
                    </button>
                    <input className="searchbar_form_submit" value={"Guardar Cambios"} type="submit" onClick={guardarOrdenes} />
                </div>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Cliente</th>
                            <th>Proveedor</th>
                            <th>Observaciones</th>
                            <th>Monto</th>
                            <th>Aceptada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOrders().map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.fecha}</td>
                                <td>{order.usuario}</td>
                                <td>{order.cliente}</td>
                                <td>{order.proveedor}</td>
                                <td>{order.observaciones}</td>
                                <td>{order.monto_total}</td>
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={order.recibida}
                                            onChange={() => handleToggleRecibida(order.id)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td>
                                    <div className="actions">
                                        <FaList
                                            className="action-icon"
                                            onClick={() => handleOpenModal(order)}
                                            style={{ width: '28px', height: '28px' ,cursor: 'pointer', marginRight: '10px' }}
                                        />
                                        <FaRegEdit
                                            className="action-icon"
                                            onClick={() => handleEditOrder(order.id)}
                                            style={{ width: '28px', height: '28px' ,cursor: 'pointer', marginRight: '10px' }}
                                        />
                                        <MdDelete
                                            className="action-icon"
                                            onClick={() => handleDeleteOrder(order.id)}
                                            style={{  width: '28px', height: '28px' ,cursor: 'pointer' }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-controls">
                    {Array.from({ length: Math.ceil(orderToFetch.length / itemsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            {showModal && <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} onOrderDeleted={traerOrders} />}
        </section>
    );
};

export default OrdersAdmin;