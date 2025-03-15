// Formulario que genera archivos PDF para Presupuestar
import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useEffect } from "react";
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
        nombreUsuario: "" 
    });
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setFormData((prevData) => ({
                ...prevData,
                nombreUsuario: parsedUser.nombre 
            }));
        }
    }, []);
    const [logo, setLogo] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleGeneratePDF = async () => {
        const formDataToSend = new FormData();
        for (const key in formData) {
        formDataToSend.append(key, formData[key]);
        }
        if (logo) {
        formDataToSend.append("logo", logo);
        }

        try {
            const response = await fetch("https://twinpack.com.ar/sistema/php/generarPDF.php", {
                method: "POST",
                body: formDataToSend,
            });
            if (response.ok) {
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
                    <div className="div-cliente-presupuesto">
                        <label className="label-presupuesto">Logo:</label>
                        <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="row_input"
                        />
                    </div>
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