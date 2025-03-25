/* Modal que muestra los estados y detalles de una Orden*/

import React, {useState,useEffect,useContext, useRef} from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {GrClose} from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import {useHistory} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {UserContext} from "../contexts/UserContext";

export default function AnimatedModal({show,handleClose,id,cliente,numero_orden,proveedor,categoria, fecha_entrega, monto_total, observaciones,motivo_no_asignacion}) {
    let history = useHistory();
    const {user} = useContext(UserContext);
    const refObs = useRef(null);
    const refMot = useRef(null);
    const [statusMotive, setStatusMotive] = useState(motivo_no_asignacion);
    const [statusObs, setStatusObs] = useState(observaciones);
    const [edit, setEdit] = useState(false);
    const [status_item, setStatusItem] = useState([]);
    const [files,setFiles] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    function traerItemStatus() {
        var xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function() {
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
//        xmlhttp1.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_orden_status.php', true);
        xmlhttp1.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_orden_status.php', true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
    }
    
    useEffect( () => {
        if (show) {
            traerItemStatus();
            traerArchivos(); 
        }
        setTimeout(function(){
            refObs.current.style.height = "5px";
            let new_height = (refObs.current.scrollHeight + 10)
            refObs.current.style.height = (new_height)+"px";
            refMot.current.style.height = "5px";
            let new_heightMot = (refMot.current.scrollHeight + 10)
            refMot.current.style.height = (new_heightMot)+"px";
        },200)
    },[show])

    function getIconStatus(i,index){
        if(i==0){
            return <FaPlus style={{display:edit ? "inline-block" : "none"}} id={"icon"+index} className="icon_edit" onClick={onChangeItem}/>
        } else {
            return null;
        }
    }

    const onChangeItem = (e) => {
        let id_order = e.target.parentElement.id;
        if (id_order ===""){
          id_order = e.target.parentElement.id
        }
        id_order = id_order.substring(4);
        let status_item_new = [...status_item];        
        if(status_item_new[id_order].dd === "0"){
            status_item_new[id_order].dd = "1";
        } else {
            status_item_new[id_order].dd = "0";
        }   
        setStatusItem(status_item_new);
    }

    const onEdit = (e) => {
        setEdit(prevState => !prevState);
        let status_item_new = [...status_item];
        status_item_new = status_item_new.map(i =>{
            i.d = "1";
            return i;
        });
        setStatusItem(status_item_new)
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
//            .post("https://twinpack.com.ar/sistema/php/guardar_datos.php", formData)
            .post("http://localhost/pruebaTwinpack/php/guardar_datos.php", formData)
            .then((res) => {
                console.log("Respuesta del backend:", res.data);
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
//        axios.post('https://twinpack.com.ar/sistema/php/buscar_archivos.php', params)
        axios.post('http://localhost/pruebaTwinpack/php/buscar_archivos.php', params)
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
    const onCancel = (e) => {
        e.preventDefault();
        traerItemStatus();
        setEdit(0);
    }

    const onChangeDate = (e, index) => {
        let status_item_new = [...status_item];
        status_item_new[index].created = e.target.value;
        setStatusItem(status_item_new);
    
        const data = new FormData();
        data.append('ID', id);
        data.append('StatusItems', JSON.stringify(status_item_new));
    
//        axios.post('https://twinpack.com.ar/sistema/php/guardar_estados_todos.php', data)
        axios.post('http://localhost/pruebaTwinpack/php/guardar_estados_todos.php', data)
            .then(response => {
                console.log("Respuesta del backend:", response.data);
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
        if (selectedItem === index) {
            console.log(`Deseleccionado: Círculo ${index}, Estado: ${status_item[index].status}`);
            setSelectedItem(null);
        } else {
            console.log(`Seleccionado: Círculo ${index}, Estado: ${status_item[index].status}`);
            setSelectedItem(index);
        }
    };

    const onChangeObs = (e) => {
        setStatusObs(e.target.value);
        e.target.style.height = "5px";
        e.target.style.height = (e.target.scrollHeight)+"px";
    }

    const handleCloseAndReload = () => {
        handleClose();
        window.location.reload();
    };

    const onChangeMotive = (e) => {
        setStatusMotive(e.target.value);
    }

    const order = [
        "Cotizado",
        "Orden de Compra Emitida",
        "Proceso de Diseño y Desarrollo",
        "Producción",
        "Chequeado"
    ];
    
    const sortedStatusItems = status_item;
    
    const status_items = sortedStatusItems.map((item, index) => (
        <div key={item.id} style={{ backgroundColor: item.dd === "0" ? "rgb(220,220,220)" : "white" }}>
            <div className="div_status" style={{ display: item.d === "0" ? "none" : "inline-block" }}>
                <div className="radio_status" style={{ background: selectedItem === index ? '#9f0059' : (!!item.created ? '#9f0059' : 'white') }} onClick={() => handleCircleClick(index)}></div>
                {selectedItem === index ? (
                    <><input type="date" style={{ border: "solid 1px" }} autoComplete="none" className="label_status pp_status_date" value={item.created || ''} onChange={(e) => onChangeDate(e, index)} /></>
                ) : (
                    <><label className="label_status pp_status">{item.status}</label></>
                )}
                {getIconStatus(item.dd, index)}
            </div>
        </div>
    ));

    let boton_editar;
    if(user.tipo == 2 || user.tipo==3){
        boton_editar = <div></div>
    }
    if (user.tipo == 1) {
        boton_editar = 
            <React.Fragment>
                <div>
                    <button style={{ display: edit ? "none" : "inline-block", float: "right" }} className="editproductform__submit searchbar_form_submit" onClick={onEdit}>Editar</button>
                </div>
                <div style={{ display: edit ? "inline-block" : "none" }}>
                    <button className="searchbar_form_submit editproductform__cancel" onClick={onCancel}>Cancelar</button>
                    <input type="submit" value={"Confirmar"} className="editproductform__submit searchbar_form_submit" onClick={onSubmit} />
                    <p>Se cambiarán los estados de todos los items incluidos en esta Solicitud</p>
                </div>
            </React.Fragment>
    }
    let boton_eliminar;

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className="modal"
                open={show}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={show}>
                    <div className="paper" >
                        <GrClose className="modal_image_close" onClick={handleCloseAndReload}/>
                        <div className="half_paper_left">
                            <h2>Número de Solicitud: {numero_orden}</h2>
                            <p>Cliente: {cliente}</p>
                            <p>Proveedor: {proveedor}</p>
                            <p>Categoría: {categoria}</p>
                            <p>Monto: {monto_total}</p>
                            <p>Fecha de entrega: {fecha_entrega}</p>
                            <div style={{ display: 'flex', margin: '-5px 0px' }}>
                                <p>Archivos:</p>
                                <div>
                                    {files.length > 0 ? (
                                        files.map((file) => (
                                            <React.Fragment key={file.name}>
                                                <a target="_blank" href={`http://localhost/pruebaTwinpack/php/uploads/${file.name}`}>
                                                    <p className="file_edit">{file.name}</p>
                                                </a>
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <p>No hay archivos disponibles</p>
                                    )}
                                </div>
                            </div>
                            <div style={{display:'flex', margin: '-5px 0px'}}>
                                <p style = {{display: 'inline-block'}}>Observaciones:</p>
                                <textarea ref={refObs} value={statusObs} style={{borderBottom:edit ? "solid 1px" : "none", display: 'inline-block'}} autoComplete="none" disabled = {edit ? false : true} className = "label_status pp_status_obs" onChange={onChangeObs}/>
                            </div>
                            <div style={{display: ((statusMotive != "" && statusMotive != null) || edit) ? 'flex' : 'none', margin: '-5px 0px'}}>
                                <p style = {{display: 'inline-block'}} >Motivo de NO Asignación:</p>
                                <textarea ref={refMot} value={statusMotive} style={{borderBottom:edit ? "solid 1px" : "none", display: 'inline-block'}} autoComplete="none" disabled = {edit ? false : true} className = "label_status pp_status_obs" onChange={onChangeMotive}/>    
                           </div>
                        </div>
                        <div className="half_paper_right">
                            <div className="graph">
                                {status_items}
                            </div>
                            {boton_eliminar}
                            {boton_editar}
                        </div>                            
                    </div>
                </Fade>
            </Modal>
        </>
    );
}