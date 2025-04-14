import React, { useState, useEffect, useContext, useRef } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { GrClose } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/UserContext";
import EditQuotation from './EditQuotation';
import { MdDelete } from "react-icons/md";

export default function AnimatedModal({ show, handleClose, id, cliente, numero_orden, proveedor, categoria, fecha_entrega, monto_total, observaciones, motivo_no_asignacion, }) {
    let history = useHistory();
    const { user } = useContext(UserContext);
    const refObs = useRef(null);
    const [statusMotive, setStatusMotive] = useState(motivo_no_asignacion);
    const [statusObs, setStatusObs] = useState(observaciones);
    const [edit, setEdit] = useState(false);
    const [status_item, setStatusItem] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Estado para alternar entre vista y edición

    function traerItemStatus() {
        var xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function () {
            if (xmlhttp1.readyState === 4) {
                if (xmlhttp1.status === 200) {
                    try {
                        let respuesta1 = JSON.parse(xmlhttp1.responseText);
                        if (Array.isArray(respuesta1.items)) {
                            setStatusItem(respuesta1.items);
                        } else {
                            setStatusItem([]);
                        }
                    } catch (error) {
                        setStatusItem([]);
                    }
                } else {
                    setStatusItem([]);
                }
            }
        };
        var cadenaParametros = `ID=${encodeURIComponent(id)}`;
        xmlhttp1.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_orden_status.php', true);
//        xmlhttp1.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_orden_status.php', true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
    }

    useEffect(() => {
        if (show) {
            traerItemStatus();
            traerArchivos();
        }
        setTimeout(() => {
            if (refObs.current) {
                refObs.current.style.height = "5px";
                let new_height = refObs.current.scrollHeight + 10;
                refObs.current.style.height = `${new_height}px`;
            }
        }, 200);
    }, [show]);

    function getIconStatus(i, index) {
        if (i === 0) {
            return <FaPlus style={{ display: edit ? "inline-block" : "none" }} id={"icon" + index} className="icon_edit" onClick={onChangeItem} />;
        } else {
            return null;
        }
    }

    const onChangeItem = (e) => {
        let id_order = e.target.parentElement.id;
        if (id_order === "") {
            id_order = e.target.parentElement.id;
        }
        id_order = id_order.substring(4);
        let status_item_new = [...status_item];
        if (status_item_new[id_order].dd === "0") {
            status_item_new[id_order].dd = "1";
        } else {
            status_item_new[id_order].dd = "0";
        }
        setStatusItem(status_item_new);
    }

    const onEdit = (e) => {
        setEdit(prevState => !prevState);
        let status_item_new = [...status_item];
        status_item_new = status_item_new.map(i => {
            i.d = "1";
            return i;
        });
        setStatusItem(status_item_new);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setEdit(0);
        let status_item_new = [...status_item];
        status_item_new = status_item_new.map(i => {
            if (i.dd === "0") {
                i.d = "0";
            }
            return i;
        })

        setStatusItem(status_item_new);
        const formData = new FormData();
        formData.append("ID", id);
        formData.append("Motivos", statusMotive);
        formData.append("Observaciones", statusObs);

        axios
            .post("https://twinpack.com.ar/sistema/php/guardar_datos.php", formData)
//            .post("http://localhost/pruebaTwinpack/php/guardar_datos.php", formData)
            .then((res) => {
                if (res.data.logs) {
                    res.data.logs.forEach(log => console.log(log));
                }
                if (res.data.status === 'success') {
                    toast.success(res.data.message);
                } else if (res.data.status === 'error') {
                    toast.error(res.data.message);
                } else {
                    toast.info(res.data.message);
                }
                if (res.data.message === "Debe iniciar Sesion") {
                    history.push("/");
                }
                window.location.reload();

            })
            .catch((err) => {
                console.log("Error", err);
                toast.error("Ocurrió un Error al intentar guardar los cambios");
            });
    };

    const traerArchivos = () => {
        const params = new URLSearchParams({ ID: id }).toString();
        axios.post('https://twinpack.com.ar/sistema/php/buscar_archivos.php', params)
//        axios.post('http://localhost/pruebaTwinpack/php/buscar_archivos.php', params)
            .then(response => {
                if (response.data && Array.isArray(response.data.files)) {
                    setFiles(response.data.files);
                } else {
                    setFiles([]);
                }
            })
            .catch(error => {
                setFiles([]);
            });
    };

    const onChangeDate = (e, index) => {
        let status_item_new = [...status_item];
        status_item_new[index].created = e.target.value;
        setStatusItem(status_item_new);

        const data = new FormData();
        data.append('ID', id);
        data.append('StatusItems', JSON.stringify(status_item_new));

        axios.post('https://twinpack.com.ar/sistema/php/guardar_estados_todos.php', data)
//        axios.post('http://localhost/pruebaTwinpack/php/guardar_estados_todos.php', data)
            .then(response => {
                if (response.data.logs) {
                    response.data.logs.forEach(log => console.log(log));
                }
            })
            .catch(error => {
                console.error("Error al enviar datos al backend:", error);
                toast.error("Error al guardar los cambios");
            });
    };
    const handleCircleClick = (index) => {
        setSelectedItem(selectedItem === index ? null : index);
    };

    const handleCloseAndReload = () => {
        handleClose();
        window.location.reload();
    };

    const handleDeleteFile = async (file) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este archivo?");
        if (confirmDelete) {
            try {
                const response = await axios.post(
                    'https://twinpack.com.ar/sistema/php/eliminar_file.php',
//                    'http://localhost/pruebaTwinpack/php/eliminar_file.php',
                    new URLSearchParams({ nombre: file.nombre, origen: file.origen })
                );
                if (response.data.message === "Archivo eliminado correctamente") {
                    setFiles((prevFiles) => prevFiles.filter((f) => f.nombre !== file.nombre));
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
    const order = [
        "Cotizado",
        "Orden de Compra Emitida",
        "Proceso de Diseño y Desarrollo",
        "Producción",
        "Chequeado"
    ];

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className="modal"
            open={show}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={show}>
                <div className="paper">
                    <GrClose className="modal_image_close" onClick={handleCloseAndReload} />
                    {isEditing ? (
                        <EditQuotation
                            orderId={id} // Pasa el ID de la orden
                            onClose={() => setIsEditing(false)} // Cierra el modo de edición
                        />
                    ) : (
                        <>
                            <h2>Número de Solicitud: {numero_orden}</h2>
                            {/* Stepper arriba */}
                            <div className="stepper">
                                {order.map((item, index) => (
                                    <div key={index} className="step">
                                        <div
                                            className="circle"
                                            style={{
                                                background:
                                                    selectedItem === index
                                                        ? '#9f0059'
                                                        : !!status_item[index]?.created
                                                        ? '#9f0059'
                                                        : 'white',
                                            }}
                                            onClick={() => handleCircleClick(index)}
                                        ></div>
                                        <label className="label">{item}</label>
                                        {selectedItem === index && (
                                            <input
                                                type="date"
                                                style={{
                                                    border: "solid 1px",
                                                    background: "white",
                                                    borderRadius: "5px",
                                                    width: "100px",
                                                }}
                                                autoComplete="none"
                                                className="label_status pp_status_date"
                                                value={status_item[index]?.created || ''}
                                                onChange={(e) => onChangeDate(e, index)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
    
                            {/* Observaciones y Archivos en la misma fila */}
                            <div className="content_row">
                                <div className="observaciones_div">
                                    <p>Observaciones:</p>
                                    <textarea
                                        ref={refObs}
                                        value={statusObs}
                                        autoComplete="none"
                                        className="label_status pp_status_obs"
                                        onChange={(e) => setStatusObs(e.target.value)}
                                        readOnly
                                    />
                                </div>
                                <div className="archivos_div">
                                    <p>Archivos:</p>
                                    <div className="files">
                                        {files.length > 0 ? (
                                            files.map((file) => (
                                                <div key={file.nombre} className="file">
                                                    <a
                                                        target="_blank"
                                                        href={`https://twinpack.com.ar/sistema/php/uploads/${file.nombre}`}
                                                        rel="noopener noreferrer"
                                                    >
                                                        <p className="name">{file.nombre}</p>
                                                    </a>
                                                    <MdDelete
                                                        className="delete-file-icon"
                                                        onClick={() => handleDeleteFile(file)}
                                                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hay archivos disponibles</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Fade>
        </Modal>
    );
}