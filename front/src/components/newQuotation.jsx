// Formulario para crear nuevas cotizaciones

import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/UserContext";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const NewQuotation = () => {
    const { user } = useContext(UserContext);
    const history = useHistory();
    const [inputClient, setInputClient] = useState("");
    const [inputProvider, setInputProvider] = useState("");
    const [inputObservations, setInputObservations] = useState("");
    const [orderItems, setOrderItems] = useState([]);
    const [clients, setClients] = useState([]);
    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchClientsAndProviders = async () => {
            try {
                const response = await axios.post('https://twinpack.com.ar/sistema/php/buscar_terceros.php');
                console.log(response.data);
                const itemsArray = response.data;
                setClients(itemsArray.filter(item => item.tipo_other === 2));
                setProviders(itemsArray.filter(item => item.tipo_other === 3));
            } catch (error) {
                console.error("Error fetching clients and providers:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.post('https://twinpack.com.ar/sistema/php/buscar_categorias.php');
                console.log("Categorías cargadas:", response.data); 
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchClientsAndProviders();
        fetchCategories();

        const savedOrderItems = JSON.parse(localStorage.getItem("orderItems_new")) || [];
        setOrderItems(savedOrderItems);
        setInputClient(localStorage.getItem("inputClient") || "");
        setInputProvider(localStorage.getItem("inputProvider") || "");
        setInputObservations(localStorage.getItem("inputObservations") || "");

        const savedFiles = JSON.parse(localStorage.getItem("files")) || [];
        const loadedFiles = savedFiles.map(file => {
            const byteString = atob(file.base64.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: file.type });
            return new File([blob], file.name, { type: file.type });
        });
        setFiles(loadedFiles);
    }, []);

    const getCategoryName = (categoryId) => {
        if (!categoryId) return "Desconocida";
        console.log("Category ID:", categoryId); 
        console.log("Categorías disponibles:", categories); 
        const category = categories.find(cat => Number(cat.id) === Number(categoryId));
        console.log("Found Category:", category); 
        return category ? category.categoria : "Desconocida";
    };
    

    const calculateTotalAmount = () => {
        return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleSubmit = async () => {
        if (!inputClient || !inputProvider) {
            toast.error("Por favor, complete todos los campos antes de enviar la cotización.");
            return;
        }
        if (orderItems.length === 0) {
            toast.error("Debe agregar al menos un producto antes de enviar la cotización.");
            return;
        }

        const totalAmount = calculateTotalAmount();
        try {
            const formData = new FormData();
            formData.append("Cliente", inputClient);
            formData.append("Proveedor", inputProvider);
            formData.append("Observaciones", inputObservations);
            formData.append("user_id", user.id);
            formData.append("orderItems", JSON.stringify(orderItems));
            formData.append("totalAmount", totalAmount);
            console.log("Order Items:", orderItems);
            files.forEach((file, index) => {
                formData.append(`file_${index}`, file);
            });

            axios.post("https://twinpack.com.ar/sistema/php/checkoutOrder.php", formData)
                .then((res) => {
                    console.log("Response from checkoutOrder:", res.data);
                    if (res.data[0] === "Solicitud enviada correctamente") {
                        toast.success("Cotización enviada con éxito.");
                        localStorage.removeItem("orderItems_new");
                        localStorage.removeItem("inputClient");
                        localStorage.removeItem("inputProvider");
                        localStorage.removeItem("inputObservations");
                        localStorage.removeItem("files");
                        history.push("/dashboard/cotizaciones");
                    } else {
                        toast.error("Error: " + (res.data.message || "Respuesta no válida del servidor"));
                    }
                })
                .catch((err) => {
                    toast.error("Error al enviar la cotización.");
                    console.error("Error al enviar la cotización:", err);
                });
        } catch (error) {
            toast.error("Error al enviar los productos.");
        }
    };

    const handleCancel = () => {
        localStorage.removeItem("orderItems_new");
        localStorage.removeItem("inputClient");
        localStorage.removeItem("inputProvider");
        localStorage.removeItem("inputObservations");
        localStorage.removeItem("files");
        history.push("/dashboard/cotizaciones");
    };

    const handleAddProduct = () => {
        localStorage.setItem("inputClient", inputClient);
        localStorage.setItem("inputProvider", inputProvider);
        localStorage.setItem("inputObservations", inputObservations);
        const filesToSave = files.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise(resolve => {
                reader.onload = () => {
                    resolve({
                        name: file.name,
                        type: file.type,
                        base64: reader.result
                    });
                };
            });
        });

        Promise.all(filesToSave).then(savedFiles => {
            localStorage.setItem("files", JSON.stringify(savedFiles));
            history.push({
                pathname: "/dashboard/addproduct",
                state: { orderId: "new", returnPath: "/dashboard/newquotation" }
            });
        });
    };

    const handleDeleteProduct = (index) => {
        const updatedOrderItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedOrderItems);
        localStorage.setItem("orderItems_new", JSON.stringify(updatedOrderItems));
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        const filesToSave = updatedFiles.map(file => ({
            name: file.name,
            type: file.type,
            base64: file.base64
        }));
        localStorage.setItem("files", JSON.stringify(filesToSave));
    };

    return (
        <section className="newquotation__section">
            <div className="container-newquotation">
                <h2 className="newquotation__title">Nueva Cotización</h2>
                <form>
                    <div className="div-cliente-newquotation">
                        <label className="label_solicitud_newquotation">Cliente:</label>
                        <select className="row_input" value={inputClient} onChange={(e) => setInputClient(e.target.value)}>
                            <option value="">Seleccione un cliente</option>
                            {clients.map((client) => (
                                <option key={client.id_other} value={client.id_other}>
                                    {client.tercero}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="div-cliente-newquotation">
                        <label className="label_solicitud_newquotation">Proveedor:</label>
                        <select className="row_input" value={inputProvider} onChange={(e) => setInputProvider(e.target.value)}>
                            <option value="">Seleccione un proveedor</option>
                            {providers.map((provider) => (
                                <option key={provider.id_other} value={provider.id_other}>
                                    {provider.tercero}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="div-cliente-newquotation">
                        <label className="label_solicitud_newquotation">Observaciones:</label>
                        <textarea className="textarea_input" value={inputObservations} onChange={(e) => setInputObservations(e.target.value)} />
                    </div>
                    <div className="div-cliente-newquotation">
                        <label className="file-upload-label">
                            <FaFileUpload size={20} />
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => {
                                    const selectedFiles = Array.from(e.target.files);
                                    setFiles([...files, ...selectedFiles]);
                                }}
                            />
                            Subir Archivo (PDF, Imágenes)
                        </label>
                    </div>
                    <div className="file-list">
                        <h4>Archivos Cargados:</h4>
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>
                                    {file.name}
                                    <MdDelete
                                        className="delete-file-icon"
                                        onClick={() => handleDeleteFile(index)}
                                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    {orderItems.length === 0 && (
                        <div>
                            <button className="newquotation__submit" type="button" onClick={handleAddProduct}>
                                Agregar Producto
                            </button>
                        </div>
                    )}
                </form>
                <h3>Productos Agregados</h3>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Fecha</th>
                            <th>Número de Plano</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map((item, index) => (
                            <tr key={index}>
                                <td>{getCategoryName(item.category)}</td>
                                <td>{item.description}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.date}</td>
                                <td>{item.number}</td>
                                <td>
                                    <MdDelete
                                        className="action-icon"
                                        onClick={() => handleDeleteProduct(index)}
                                        style={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', backgroundColor: '#D9534F', borderRadius: '5px', cursor: 'pointer' }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <h4>Total: {calculateTotalAmount()}</h4>
                </div>
                <div>
                    <button className="newquotation__submit" type="button" onClick={handleSubmit}>
                        Enviar Cotización
                    </button>
                    <button className="newquotation__submit" type="button" onClick={handleCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewQuotation;