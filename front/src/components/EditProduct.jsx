import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

const EditProduct = () => {
    const history = useHistory();
    const location = useLocation();
    const { product, orderId, returnPath, reopenModal } = location.state || {};
    const { user } = useContext(UserContext); 
    const [inputQuantity, setInputQuantity] = useState(product.quantity || "");
    const [inputPrice, setInputPrice] = useState(
        product.price ? Number(product.price).toFixed(2) : ""
    );
        const [inputDescription, setInputDescription] = useState(product.description || "");
    const [inputDate, setInputDate] = useState(product.date || "");
    const [inputNumber, setInputNumber] = useState(product.number || "");
    const [inputObservations, setInputObservations] = useState(product.observations || "");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(product.category || "");

    useEffect(() => {
//        axios.post('https://twinpack.com.ar/sistema/php/buscar_categorias.php')
            axios.post('http://localhost/pruebaTwinpack/php/buscar_categorias.php')
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    const handleCancel = () => {
        history.push({
            pathname: returnPath || "/dashboard",
            state: { reopenModal, orderId }
        });
    };

    const calculateNewTotalAmount = () => {
        const newTotalAmount = parseFloat(inputPrice) * parseFloat(inputQuantity);
        return newTotalAmount.toFixed(2);
    };

    const updateOrderAmount = async () => {
        const newTotalAmount = calculateNewTotalAmount();
        console.log("Actualizando monto total de la orden:", newTotalAmount); // Log para ver el nuevo monto total
        try {
//            const response = await axios.post('https://twinpack.com.ar/sistema/php/editar_orden.php', new URLSearchParams({
                const response = await axios.post('http://localhost/pruebaTwinpack/php/editar_orden.php', new URLSearchParams({
                    orderId: orderId,
                Monto: newTotalAmount
            }));
            console.log("Respuesta del servidor al actualizar el monto total de la orden:", response.data); // Log para ver la respuesta del servidor
            if (response.data.success) {
                toast.success("Monto total de la orden actualizado correctamente");
            } else {
                console.error('Error al actualizar el monto total de la orden:', response.data.message);
                toast.error("Error al actualizar el monto total de la orden");
            }
        } catch (error) {
            console.error('Error al actualizar el monto total de la orden:', error);
            toast.error("Error al actualizar el monto total de la orden");
        }
    };

    const handleEditProduct = () => {
        if (!inputQuantity || !inputPrice || !inputDescription || !inputDate || !selectedCategory) {
            toast.error("Por favor, complete todos los campos antes de editar el ítem.");
            return;
        }
        const updatedProduct = {
            id: product.id,
            quantity: Number(inputQuantity).toFixed(2), // Redondear a dos decimales
            price: Number(inputPrice).toFixed(2), // Redondear a dos decimales
            description: inputDescription,
            date: inputDate,
            number: inputNumber,
            category: selectedCategory,
            observations: inputObservations,
            user_id: user.id 
        };
//        axios.post('https://twinpack.com.ar/sistema/php/editar_producto.php', new URLSearchParams(updatedProduct))
            axios.post('http://localhost/pruebaTwinpack/php/editar_producto.php', new URLSearchParams(updatedProduct))
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                if (response.data === "Producto actualizado correctamente") {
                    toast.success("Producto actualizado correctamente");
                    updateOrderAmount(); // Actualizar el monto total de la orden
                    history.push({
                        pathname: returnPath || "/dashboard",
                        state: { reopenModal, orderId }
                    });
                } else {
                    toast.error("Error al actualizar el producto");
                }
            })
            .catch((error) => {
                console.error("Error al actualizar el producto:", error);
                toast.error("Error al actualizar el producto");
            });
    };

    return (
        <section className="addproduct__section">
            <div className="container-addproduct">
                <h2 className="addproduct__title">Editar Producto</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleEditProduct(); }}>
                <div className="div-cliente-addproduct">
                    <label className="label_solicitud_addproduct">Categoría:</label>
                        <select className="row_input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Seleccione una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="div-cliente-addproduct">
                        <label className="label_solicitud_addproduct">Descripción:</label>
                        <input className="row_input" type="text" value={inputDescription} onChange={(e) => setInputDescription(e.target.value)} />
                    </div>
                    <div className="div-cliente-addproduct">
                        <label className="label_solicitud_addproduct">Cantidad:</label>
                        <input className="row_input" type="number" value={inputQuantity} onChange={(e) => setInputQuantity(e.target.value)} />
                    </div>
                    <div className="div-cliente-addproduct">
                        <label className="label_solicitud_addproduct">Precio:</label>
                        <input className="row_input" type="number" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} />
                    </div>    
                    <div className="div-cliente-addproduct">
                        <label className="label_solicitud_addproduct">Fecha:</label>
                        <input className="row_input" type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} />
                    </div>
                    <div className="div-cliente-addproduct">
                        <label className="label_solicitud_addproduct">Número:</label>
                        <input className="row_input" type="text" value={inputNumber} onChange={(e) => setInputNumber(e.target.value)} />
                    </div>
                    <div className="div-cliente-addproduct">
                        <label className="label_solicitud_addproduct">Observaciones:</label>
                        <textarea value={inputObservations} onChange={(e) => setInputObservations(e.target.value)} />
                    </div>
                    <div className="addProduct-button">
                        <button className="addproduct__submit" type="submit">Editar Producto</button>
                        <button className="addproduct__submit" type="button" onClick={handleCancel}>Cancelar</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default EditProduct;