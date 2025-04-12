import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const OrderDetailModal = ({ order, onClose }) => {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [localProducts, setLocalProducts] = useState([]);
    const [discountedAmount, setDiscountedAmount] = useState(0); 
    const [orderFiles, setOrderFiles] = useState([]); 
    const [orderDate, setOrderDate] = useState(""); // Nuevo estado para almacenar la fecha de la orden
    const isMounted = useRef(false);

    const fetchOrderDetails = () => {
        const xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function () {
            if (xmlhttp1.readyState === 4 && xmlhttp1.status === 200) {
                const respuesta1 = xmlhttp1.responseText;
                if (respuesta1 === "Debe iniciar Sesion") {
                    history.push("/");
                    return;
                }
                try {
                    const data = JSON.parse(respuesta1);
                    if (isMounted.current) {
                        setProducts(data[1] || []); 
                        setOrderFiles(data[2] || []); 

                        if (data[1] && data[1].length > 0) {
                            setOrderDate(data[1][0].date); // Guardar la fecha del primer producto
                        }
                    }
                } catch (error) {
                    console.error("Error al parsear la respuesta del servidor:", error);
                }
            }
        };
        const cadenaParametros = `Sort=id&Search=&Filter=&SelectedPage=1&idOrder=${order.id}`;
//        xmlhttp1.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_items.php', true);
        xmlhttp1.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_items.php', true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
    };

    useEffect(() => {
        isMounted.current = true;
        fetchOrderDetails();
        fetchDiscountedAmount();
        const storedProducts = JSON.parse(localStorage.getItem('orderItems_new')) || [];
        setLocalProducts(storedProducts);
        return () => {
            isMounted.current = false;
        };
    }, [order.id]);

    const handleBudget = () => {
        history.push({
            pathname: "/dashboard/presupuesto",
            state: { orderId: order.id, totalAmount: discountedAmount }
        });
    };

    const handleAddProduct = () => {
        history.push({
            pathname: "/dashboard/addproduct",
            state: { orderId: order.id, returnPath: "/dashboard/cotizaciones", reopenModal: true, inputDate: orderDate }
        });
    };

    const handleEditProduct = (product) => {
        history.push({
            pathname: "/dashboard/editproduct",
            state: { product, orderId: order.id, returnPath: "/dashboard/cotizaciones", reopenModal: true }
        });
    };

    const handleDeleteProduct = async (product) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmDelete) {
            try {
//                const response = await axios.post('https://twinpack.com.ar/sistema/php/eliminar_producto.php', new URLSearchParams({ id: product.id }));
                const response = await axios.post('http://localhost/pruebaTwinpack/php/eliminar_producto.php', new URLSearchParams({ id: product.id }));
                if (response.data === "Producto eliminado correctamente") {
                    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));
                    toast.success("Producto eliminado correctamente");
                } else {
                    console.error("Error al eliminar el producto");
                    toast.error("Error al eliminar el producto");
                }
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                toast.error("Error al eliminar el producto");
            }
        }
    };

    const handleSaveChanges = async () => {
        const bandera = 0;
        try {
//            const response = await axios.post('https://twinpack.com.ar/sistema/php/checkout.php', new URLSearchParams({
                const response = await axios.post('http://localhost/pruebaTwinpack/php/checkout.php', new URLSearchParams({
                    orderItems: JSON.stringify(localProducts),
                order_id: order.id,
                source: "OrderDetailModal"
            }));
        
            if (response.data.message === "Producto agregado correctamente") {
                toast.success("Productos agregados correctamente");
                console.log("Respuesta del servidor:", response.data);
                localStorage.removeItem('orderItems_new');
                setLocalProducts([]);
                fetchOrderDetails(); 
            } else {
                console.error("Error al agregar los productos. Respuesta del servidor:", response.data);
                toast.error("Error al agregar los productos");
            }
        } catch (error) {
            console.error("Error al agregar los productos:", error);
            toast.error("Error al agregar los productos");
        }
    };
    
    const handleDeleteLocalProduct = (index) => {
        const updatedLocalProducts = localProducts.filter((_, i) => i !== index);
        setLocalProducts(updatedLocalProducts);
        localStorage.setItem("orderItems_new", JSON.stringify(updatedLocalProducts));
    };

    const handleDeleteFile = async (file) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este archivo?");
        if (confirmDelete) {
            try {
                const response = await axios.post(
//                    'https://twinpack.com.ar/sistema/php/eliminar_file.php',
                    'http://localhost/pruebaTwinpack/php/eliminar_file.php',
                    new URLSearchParams({ nombre: file.nombre, origen: file.origen })
                );
                if (response.data.message === "Archivo eliminado correctamente") {
                    setOrderFiles((prevFiles) => prevFiles.filter((f) => f.nombre !== file.nombre));
                    toast.success("Archivo eliminado correctamente");
                } else {
                    console.error("Error al eliminar el archivo");
                    toast.error("Error al eliminar el archivo");
                }
            } catch (error) {
                console.error("Error al eliminar el archivo:", error);
                toast.error("Error al eliminar el archivo");
            }
        }
    };

    const calculateTotal = (price, quantity) => (price * quantity).toFixed(2);

    const calculateTotalAmount = () => {
        return products.reduce((total, product) => total + parseFloat(calculateTotal(product.price, product.quantity)), 0).toFixed(2);
    };

    const fetchDiscountedAmount = async () => {
        try {
//            const response = await axios.post('https://twinpack.com.ar/sistema/php/getOrderDetails.php', new URLSearchParams({
                const response = await axios.post('http://localhost/pruebaTwinpack/php/getOrderDetails.php', new URLSearchParams({
                    orderId: order.id,
            }));
            if (response.data && response.data.monto_total) {
                setDiscountedAmount(parseFloat(response.data.monto_total));
            } else {
                console.error('Error: Detalles de la orden no encontrados.');
            }
        } catch (error) {
            console.error('Error al obtener el monto con descuento:', error);
        }
    };

    const handleClose = () => {
        localStorage.removeItem('orderItems_new');
        window.location.reload();
        onClose();
    };

    return (
        <div className="modal-overlay-details">
            <div className="modal-content-details">
                <span className="close-details" onClick={handleClose}>&times;</span>
                <h2 className="modal-title-details">Detalle de la Orden</h2>
                <h3 className="modal-subtitle-details">Orden n° {order.id}</h3>
                <button className="add-product-button-details" onClick={handleAddProduct}>Agregar Producto</button>
                <h3>Productos agregados</h3>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Numero de Plano</th>
                            <th>Cantidad</th>
                            <th>Precio c/u</th>
                            <th>Total</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.description}</td>
                                <td>{product.categoria_nombre}</td>
                                <td>{product.number}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price ? Number(product.price).toFixed(2) : 'N/A'}</td>
                                <td>{product.price && product.quantity ? (Number(product.price) * Number(product.quantity)).toFixed(2) : 'N/A'}</td>

                                <td>{product.observations}</td>
                                <td>
                                    <div className="action-container">
                                        <FaRegEdit
                                            className="action-icon action-edit"
                                            onClick={() => handleEditProduct(product)}
                                        />
                                        <MdDelete
                                            className="action-icon action-delete"
                                            onClick={() => handleDeleteProduct(product)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {localProducts.length > 0 && (
                <>
                    <h3>Productos no agregados</h3>
                    <table className="responsive-table">
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th>Cantidad</th>
                                <th>Precio c/u</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.description}</td>
                                    <td>{product.category}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.price ? Number(product.price).toFixed(2) : 'N/A'}</td>
                                    <td>{product.price && product.quantity ? (Number(product.price) * Number(product.quantity)).toFixed(2) : 'N/A'}</td>
                                    <td>
                                        <MdDelete
                                        className="action-icon"
                                        onClick={() => handleDeleteLocalProduct(index)}
                                        style={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', backgroundColor: '#D9534F', borderRadius: '5px',cursor: 'pointer' }}
                                        />                                
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
                )}
                <h3>Archivos adjuntos</h3>
                {orderFiles.length > 0 ? (
                <ul>
                    {orderFiles.map((file, index) => (
                        <li key={index}>
                            <a href={`http://localhost/pruebaTwinpack/php/uploads/${file.nombre}`} target="_blank" rel="noopener noreferrer">
                                {file.nombre}
                            </a>
                            <MdDelete
                                className="delete-file-icon"
                                onClick={() => handleDeleteFile(file)}
                                style={{ cursor: 'pointer', marginLeft: '10px' }}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No se han adjuntado archivos</p>
            )}
                <div className="total-amount-details">
                    <h3>Monto Total: ${calculateTotalAmount()}</h3>
                    {calculateTotalAmount() !== discountedAmount && (
                        <h3>Monto con Descuento: ${typeof discountedAmount === 'number' ? discountedAmount.toFixed(2) : 'N/A'}</h3>
                    )}
                </div>
                <div className="modal-actions-details">
                    <button className="budget-button-details" onClick={handleBudget}>Presupuestar</button>
                    {localProducts.length > 0 && (
                        <>
                    <button className="budget-button-details" onClick={handleSaveChanges}>Guardar Cambios</button></>)}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;