import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const EditQuotation = () => {
    const { orderId } = useParams();
    const history = useHistory();
    const [clients, setClients] = useState([]);
    const [providers, setProviders] = useState([]);
    const [inputClient, setInputClient] = useState("");
    const [inputProvider, setInputProvider] = useState("");
    const [inputObservations, setInputObservations] = useState("");
    const [inputAmount, setInputAmount] = useState("");
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchClientsAndProviders = async () => {
            try {
//                const response = await axios.post('https://twinpack.com.ar/sistema/php/buscar_terceros.php');
                const response = await axios.post('http://localhost/pruebaTwinpack/php/buscar_terceros.php');
                const itemsArray = response.data;
                setClients(itemsArray.filter(item => item.tipo_other === 2));
                setProviders(itemsArray.filter(item => item.tipo_other === 3));
            } catch (error) {
                console.error("Error fetching clients and providers:", error);
            }
        };

        const fetchOrderDetails = async () => {
            try {
//                const response = await axios.post('https://twinpack.com.ar/sistema/php/getOrderDetails.php', new URLSearchParams({
                    const response = await axios.post('http://localhost/pruebaTwinpack/php/getOrderDetails.php', new URLSearchParams({
                        orderId: orderId
                }));
                if (response.data) {
                    setInputClient(response.data.cliente_id);
                    setInputProvider(response.data.proveedor_id);
                    setInputObservations(response.data.observaciones);
                    setInputAmount(parseFloat(response.data.monto_total).toFixed(2)); // Convertir a número y redondear a dos decimales
                }
            } catch (error) {
                console.error("Error al obtener los detalles de la orden:", error);
                toast.error("Error al obtener los detalles de la orden");
            }
        };

        fetchClientsAndProviders();
        fetchOrderDetails();
    }, [orderId]);

    const handleSaveChanges = async () => {
        if (!inputClient || !inputProvider || !inputObservations || !inputAmount) {
            toast.error("Por favor, complete todos los campos antes de guardar los cambios.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("orderId", orderId);
            formData.append("Cliente", inputClient);
            formData.append("Proveedor", inputProvider);
            formData.append("Observaciones", inputObservations);
            formData.append("Monto", parseFloat(inputAmount).toFixed(2));

            files.forEach((file, index) => {
                formData.append(`file_${index}`, file);
            });

//            const response = await axios.post("https://twinpack.com.ar/sistema/php/editar_orden.php", formData, {
                const response = await axios.post("http://localhost/pruebaTwinpack/php/editar_orden.php", formData, {
                    headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                toast.success("Cotización actualizada con éxito.");
                history.push("/dashboard/cotizaciones");
            } else {
                toast.error("Error: " + (response.data.message || "Respuesta no válida del servidor"));
            }
        } catch (error) {
            toast.error("Error al actualizar la cotización.");
            console.error("Error al actualizar la cotización:", error);
        }
    };

    const handleCancel = () => {
        history.push("/dashboard/cotizaciones");
    };

    const handleDeleteFile = (fileIndex) => {
        setFiles(files.filter((_, index) => index !== fileIndex));
        toast.success("Archivo eliminado localmente");
    };

    return (
        <section className="newquotation__section">
            <div className="container-newquotation">
                <h2 className="newquotation__title">Editar Cotización</h2>
                <form>
                    <div className="div-cliente-newquotation">
                        <label className="label_solicitud_newquotation">Cliente:</label>
                        <select className="row_input" value={inputClient} onChange={(e) => setInputClient(e.target.value)}>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.tercero}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="div-cliente-newquotation">
                        <label className="label_solicitud_newquotation">Proveedor:</label>
                        <select className="row_input" value={inputProvider} onChange={(e) => setInputProvider(e.target.value)}>
                            {providers.map((provider) => (
                                <option key={provider.id} value={provider.id}>
                                    {provider.tercero}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="div-cliente-newquotation">
                        <label className="label_solicitud_newquotation">Observaciones:</label>
                        <textarea
                            value={inputObservations}
                            onChange={(e) => setInputObservations(e.target.value)}
                        />
                    </div>
                    <div className="div-cliente-newquotation">
                        <label className="label_solicitud_newquotation">Monto:</label>
                        <input
                            className="row_input"
                            type="number"
                            value={inputAmount}
                            onChange={(e) => setInputAmount(e.target.value)}
                        />
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
                </form>
                <div>
                    <button className="newquotation__submit" type="button" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </button>
                    <button className="newquotation__submit" type="button" onClick={handleCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </section>
    );
};

export default EditQuotation;