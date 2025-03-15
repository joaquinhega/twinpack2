import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../contexts/UserContext"; 

const AddProduct = () => {
    const history = useHistory();
    const location = useLocation();
    const { orderId, returnPath, reopenModal } = location.state || {};
    const { user } = useContext(UserContext); 
    const [inputQuantity, setInputQuantity] = useState("");
    const [inputPrice, setInputPrice] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [inputDate, setInputDate] = useState("");
    const [inputNumber, setInputNumber] = useState("");
    const [inputObservations, setInputObservations] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        axios.post('https://twinpack.com.ar/sistema/php/buscar_categorias.php')
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

    const handleAddProduct = async () => {
        if (!inputQuantity || !inputPrice || !inputDescription || !inputDate || !selectedCategory) {
            toast.error("Por favor, complete todos los campos antes de agregar el ítem.");
            return;
        }
        const newItem = {
            order_id: orderId,
            quantity: parseFloat(inputQuantity),
            price: parseFloat(inputPrice).toFixed(2),
            description: inputDescription,
            date: inputDate,
            number: inputNumber,
            category: selectedCategory,
            observations: inputObservations,
            user_id: user.id 
        };

        const storedProducts = JSON.parse(localStorage.getItem('orderItems_new')) || [];
        storedProducts.push(newItem);
        localStorage.setItem('orderItems_new', JSON.stringify(storedProducts));
        toast.success("Producto agregado a localStorage");
        history.push({
            pathname: returnPath || "/dashboard",
            state: { reopenModal, orderId }
        });
    };

    return (
        <section className="addproduct__section">
            <div className="container-addproduct">
                <h2 className="addproduct__title">Agregar Producto</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }}>
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
                        <label className="label_solicitud_addproduct">Fecha de Entrega:</label>
                        <input  type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} />
                    </div>
                    <div className="div-cliente-addproduct">
                        <label className="label_solicitud_addproduct">Número de Plano:</label>
                        <input className="row_input" type="text" value={inputNumber} onChange={(e) => setInputNumber(e.target.value)} />
                    </div>
                    <div className="div-cliente-addproduct">
                        <label className="label_solicitud_addproduct">Observaciones:</label>
                        <textarea className="textarea_input"value={inputObservations} onChange={(e) => setInputObservations(e.target.value)} />
                    </div>
                    <div className="addProduct-button">
                        <button className="addproduct__submit" type="submit">Agregar Producto</button>
                        <button className="cartcheckout__submit" type="button" onClick={handleCancel}>Cancelar</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AddProduct;