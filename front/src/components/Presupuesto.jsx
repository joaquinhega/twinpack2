import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

function Presupuesto() {
    const location = useLocation();
    const history = useHistory();
    const { orderId, totalAmount } = location.state || {};
    const [formData, setFormData] = useState({
        monto: `$${totalAmount}`,
        fecha: "",
        destinatario: "",
        textoPresentacion: "",
        condiciones: "",
        orderId: orderId,
        nombreUsuario: "",
        logoPath: "",
    });
    const [logoProveedor, setLogoProveedor] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setFormData((prevData) => ({
                ...prevData,
                nombreUsuario: parsedUser.nombre,
            }));
        }

        const fetchOrderData = async () => {
            try {
                console.log("Fetching order data for orderId:", orderId);
                const response = await fetch("http://localhost/pruebaTwinpack/php/getOrderDetails.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", // Cambiar a application/x-www-form-urlencoded
                    },
                    body: new URLSearchParams({ orderId }), // Usar URLSearchParams para enviar los datos
                });
        
                console.log("Response status:", response.status);
        
                if (response.ok) {
                    const data = await response.json();
                    console.log("Order data received from server:", data);
                    setLogoProveedor(data.logo);
                    setFormData((prevData) => ({
                        ...prevData,
                    }));
                } else {
                    const errorText = await response.text();
                    console.error("Error al obtener los datos de la orden. Respuesta del servidor:", errorText);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        };

        fetchOrderData();
    }, [orderId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleGeneratePDF = async () => {
        console.log("Generando PDF con los siguientes datos:");
        console.log("Formulario:", formData);
        console.log("Logo del proveedor:", logoProveedor);
        formData.logoPath = logoProveedor;
        
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        if (logoProveedor) {
            formDataToSend.append("logo", logoProveedor); 
        }

        try {
            const response = await fetch("http://localhost/pruebaTwinpack/php/generarPDF.php", {
                method: "POST",
                body: formDataToSend,
            });
            if (response.ok) {
                console.log("PDF generado exitosamente");
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "Presupuesto.pdf";
                link.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Error al generar el PDF");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    const handleBack = () => {
        history.push("/dashboard/cotizaciones");
    };

    return (
        <div className="presupuesto__section">
            <div className="container-presupuesto">
                <h3 className="presupuesto__title">Presupuesto</h3>
                <p className="presupuesto__subtitle">Orden n°: {orderId}</p>
                <form>
                    <div className="div-cliente-presupuesto">
                        <label className="label-presupuesto">Monto total:</label>
                        <span className="row_input">{formData.monto}</span>
                    </div>
                    <div className="div-cliente-presupuesto">
                        <label className="label-presupuesto">Fecha:</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="row_input"
                        />
                    </div>
                    <div className="div-cliente-presupuesto">
                        <label className="label-presupuesto">Nombre del Usuario:</label>
                        <input
                            type="text"
                            name="nombreUsuario"
                            value={formData.nombreUsuario}
                            onChange={handleChange}
                            className="row_input"
                        />
                    </div>
                    <div className="div-cliente-presupuesto">
                        <label className="label-presupuesto">Sr/a:</label>
                        <input
                            type="text"
                            name="destinatario"
                            placeholder="Ingrese destinatario"
                            value={formData.destinatario}
                            onChange={handleChange}
                            className="row_input"
                        />
                    </div>
                    <div className="div-cliente-presupuesto">
                        <label className="label-presupuesto">Texto de Presentación:</label>
                        <textarea
                            name="textoPresentacion"
                            placeholder="Ingrese texto"
                            autoComplete="true"
                            value={formData.textoPresentacion}
                            onChange={handleChange}
                            className="textarea_input"
                        />
                    </div>
                    <div className="div-cliente-presupuesto">
                        <label className="label-presupuesto">Condiciones Comerciales:</label>
                        <textarea
                            name="condiciones"
                            placeholder="Ingrese condiciones"
                            value={formData.condiciones}
                            onChange={handleChange}
                            className="textarea_input"
                        />
                    </div>
                    {logoProveedor && (
                        <div className="div-cliente-presupuesto">
                            <label className="label-presupuesto">Logo del Proveedor:</label>
                            <img
                                src={`http://localhost/pruebaTwinpack/php/logos/${logoProveedor}`}
                                alt="Logo del proveedor"
                                style={{ maxWidth: "150px", marginTop: "10px" }}
                            />
                        </div>
                    )}
                    <div className="div-botones-presupuesto">
                        <button
                            type="button"
                            className="presupuesto__submit"
                            onClick={handleGeneratePDF}
                        >
                            Generar PDF
                        </button>
                        <button
                            type="button"
                            className="presupuesto__submit"
                            onClick={handleBack}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Presupuesto;