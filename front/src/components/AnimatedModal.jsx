/* Modal que muestra los estados y detalles de un item

import React, {useState,useEffect,useContext, useRef} from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {GrClose} from "react-icons/gr";
import {FaTrash} from "react-icons/fa";
import {FaPlus} from "react-icons/fa";
import {FaRegFilePdf} from "react-icons/fa";
import {useHistory} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {UserContext} from "../contexts/UserContext";

export default function AnimatedModal({hasChange,setHasChange,show,handleClose,id,cliente,numero_orden,proveedor,codigo_producto,categoria,descripcion,cantidad,precio,observaciones,motivo_no_asignacion,numero_plano,pie_maquina}) {

    let history = useHistory();
    const {user} = useContext(UserContext);
    const refObs = useRef(null);
    const refMot = useRef(null);
    const [inputSubmit, setInputSubmit] = useState({});
    const [statusPrice, setStatusPrice] = useState(precio);
    const [statusQuantity, setStatusQuantity] = useState(cantidad);
    const [statusMotive, setStatusMotive] = useState(motivo_no_asignacion);
    const [statusObs, setStatusObs] = useState(observaciones);
    const [edit, setEdit] = useState(false);
    let [status_item, setStatusItem] = useState([]);
    const [files,setFiles] = useState([]);

    function traerItemStatus(){
        // Hardcode estados

        var xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function() {
            if (xmlhttp1.readyState==4 && xmlhttp1.status==200) {
                let respuesta1 = xmlhttp1.responseText;
                console.log(respuesta1)
                if(respuesta1 == "Debe iniciar Sesion"){
                    history.push("/");
                }
                const initial_status_item = JSON.parse(respuesta1);
                console.log(initial_status_item);
                
                setStatusItem(initial_status_item);
                setEdit(0);
            }}
        var cadenaParametros = `ID=${encodeURIComponent(id)}`;
        xmlhttp1.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_item_status.php',true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
        }

        function traerArchivos(){;
            var xmlhttp2 = new XMLHttpRequest();
            xmlhttp2.onreadystatechange = function() {
                if (xmlhttp2.readyState==4 && xmlhttp2.status==200) {
                    let respuesta1 = xmlhttp2.responseText;
                    console.log(respuesta1)
                    if(respuesta1 == "Debe iniciar Sesion"){
                        history.push("/");
                    }
                    setFiles(JSON.parse(respuesta1));
                }}
            var cadenaParametros = `ID=${encodeURIComponent(id)}`;
            xmlhttp2.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_archivos.php',true);
            xmlhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp2.send(cadenaParametros);
        }
    
    useEffect( () => {
        traerItemStatus();
        traerArchivos();
        setTimeout(function(){
            refObs.current.style.height = "5px";
            let new_height = (refObs.current.scrollHeight + 10)
            refObs.current.style.height = (new_height)+"px";
            refMot.current.style.height = "5px";
            let new_heightMot = (refMot.current.scrollHeight + 10)
            refMot.current.style.height = (new_heightMot)+"px";
        },200)
               
    },[])

    const onChangeFile = (e) => {

        if(e.target.name === "image"){
            setInputSubmit({
                ...inputSubmit,
                image: e.target.files[0]
            })
        }else {
            setInputSubmit({
                ...inputSubmit,
                [e.target.name]: e.target.value
            })
        }
    }

    function getIconStatus(i,index){
        if(i==0){
            return <FaPlus style={{display:edit ? "inline-block" : "none"}} id={"icon"+index} className="icon_edit" onClick={onChangeItem}/>
        } else {
            return <FaTrash style={{display:edit ? "inline-block" : "none"}} id={"icon"+index} className="icon_edit" onClick={onChangeItem}/>
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
        status_item_new = status_item_new.map(i =>{
            if(i.dd === "0"){
                i.d = "0";
            }
            return i;
        })
        setStatusItem(status_item_new);
 
        const formData = new FormData();
        formData.append("StatusItems", JSON.stringify(status_item));
        formData.append("ID",id);
        formData.append("Precio",statusPrice);
        formData.append("Cantidad",statusQuantity);
        formData.append("Motivos",statusMotive);
        formData.append("Observaciones", statusObs);
        axios
            .post("http://localhost/pruebaTwinpack/php/guardar_estados.php", formData)
            .then((res) => {
                console.log("Success",res);
                toast.success(res.data);
                if(res.data == "Debe iniciar Sesion"){
                    history.push("/");
                }
                let new_hasChange = hasChange + 1;
                setHasChange(new_hasChange);
            })
            .catch((err) => {
                console.log("Error", err)
                toast.error("Ocurrió un Error al intentar guardar los cambios");
                });        
    }

    function upLoadFile(e){
        const formData = new FormData();
        formData.append("ID",id);
        formData.append("File",e.target.files[0]);
        axios
            .post("http://localhost/pruebaTwinpack/php/upload_file.php",formData)
            .then((res) => {
                console.log(res)
                if(res.data == "Debe iniciar Sesion"){
                    history.push("/");
                }
                toast.success(res.data);
                console.log(res);
                traerArchivos();
            })
            .catch((err) => {
                toast.error("Error!");
                console.log(err);
            })
    }

    const onCancel = (e) => {
        e.preventDefault();
       // history.push("/dashboard/store");
        traerItemStatus();
        setEdit(0);
    }

    const onChangeDate = (e,index) => {
        let status_item_new = [...status_item];
        status_item_new = status_item_new.map(i =>{
            return i;
        });
        status_item_new[index].created = e.target.value;
        setStatusItem(status_item_new)
    }

    const onChangeDateEntrega = (e,index) => {
        let status_item_new = [...status_item];
        status_item_new = status_item_new.map(i =>{
            return i;
        });
        status_item_new[index].entrega = e.target.value;
        setStatusItem(status_item_new)
    }

    const onChangePrice = (e) => {
        setStatusPrice(e.target.value);
    }

    const onChangeObs = (e) => {
        setStatusObs(e.target.value);
        e.target.style.height = "5px";
        e.target.style.height = (e.target.scrollHeight)+"px";
    }

    const onChangeQuantity = (e) => {
        setStatusQuantity(e.target.value);
    }

    const onChangeMotive = (e) => {
        setStatusMotive(e.target.value);
    }

    const status_items = status_item.map((item,index) =>
        <div key={item.id} style={{backgroundColor: item.dd === "0" ? "rgb(220,220,220)" : "white"}}>
            <div className="div_status" style={{display: item.d === "0" ? "none" : "inline-block"}}>
                <div className="radio_status" style={{background: !!item.created ? '#9f0059' : 'white'}}></div>
                <input type = "date" style={{visibility:(edit || !!item.created) ? 'visible': 'hidden' ,border:edit ? "solid 1px" : "none"}} autoComplete="none" disabled = {edit ? false : true} className = "label_status pp_status_date" value={item.created} onChange={(e) => onChangeDate(e,index)}/>
                <label className = "label_status pp_status">{item.status}</label>
                <div style={{display: (!!item.entrega || edit)? "inline-block" : "none"}}>
                    <label style={{display:'inline-block'}} className = "label_status">Entrega: </label>
                    <input type = "date" style={{border:edit ? "solid 1px" : "none"}} autoComplete="none" disabled = {edit ? false : true} className = "label_status pp_status_date" value={item.entrega} onChange={(e) => onChangeDateEntrega(e,index)}/>
                </div> 
                {getIconStatus(item.dd, index)}                                      
            </div>
        </div>
        )

    let boton_editar;
    if(user.tipo == 2 || user.tipo==3){
        boton_editar = <div></div>
    }

    if(user.tipo == 1){
        boton_editar = 
        <React.Fragment>
            <div>
                <button style={{display: edit ? "none" : "inline-block", float: "right"}} className="editproductform__submit searchbar_form_submit" onClick={onEdit}>Editar</button>
            </div>
            <div style={{display: edit ? "inline-block" : "none"}}>
                <button className="searchbar_form_submit editproductform__cancel" onClick={onCancel}>Cancelar</button>
                <input type="submit" value={"Confirmar"} className="editproductform__submit searchbar_form_submit" onClick={onSubmit}/>
            </div>
    </React.Fragment>
    }
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
                        <GrClose className="modal_image_close" onClick={handleClose}/>
                        <div className="half_paper_left">
                            <h2>Detalle Item</h2>
                            <div style={{display:'flex', margin: '-5px 0px'}}>
                                <p style={{display: 'inline-block'}} className="pp_detalle">Cantidad:</p>
                                <input value={statusQuantity} style={{borderBottom:edit ? "solid 1px" : "none", display: 'inline-block'}} autoComplete="none" disabled = {edit ? false : true} className = "label_status pp_status_date" onChange={onChangeQuantity}/>
                            </div>
                            <p className="pp_detalle">Descripcion: {descripcion}</p>
                            <p className="pp_detalle">Código Producto: {codigo_producto}</p>
                            <div style={{display:'flex', margin: '-5px 0px'}}>
                                <p style={{display: 'inline-block'}} className="pp_detalle">Precio:</p>
                                <input value={statusPrice} style={{borderBottom:edit ? "solid 1px" : "none", display: 'inline-block'}} autoComplete="none" disabled = {edit ? false : true} className = "label_status pp_status_date" onChange={onChangePrice}/>
                            </div>
                            <p className="pp_detalle">Total: $ {(statusQuantity * statusPrice).toLocaleString()}</p>
                            <p className="pp_detalle">Número de Plano: {numero_plano}</p>
                            <div style={{display:'flex'}}>
                                <p className="pp_detalle">Archivos:</p>
                                    <div>
                                    {       
                                        files ? (files.map((f) => (
                                            <React.Fragment>
                                                <a target="_blank" href={"https://twinpack.com.ar/sistema/archivos/"+id+"-"+f.name} >
                                                    <p key={f.name} className="file_edit">{f.name}</p>
                                                </a>
                                            </React.Fragment>
                                        ))): ""
                                    }
                                    <FaRegFilePdf className="icon_upload" />
                                    <input type="file" className="file_input" onChange={upLoadFile}/>
                                </div>
                            </div>
                            <div style={{display:'flex', margin: '-5px 0px'}}>
                                <p style = {{display: 'inline-block'}} className="pp_detalle">Observaciones:</p>
                                <textarea ref={refObs} value={statusObs} style={{borderBottom:edit ? "solid 1px" : "none", display: 'inline-block'}} autoComplete="none" disabled = {edit ? false : true} className = "label_status pp_status_obs" onChange={onChangeObs}/>
                            </div>
                            <div style={{display: ((statusMotive != "" && statusMotive != null) || edit) ? 'flex' : 'none', margin: '-5px 0px'}}>
                                <p style = {{display: 'inline-block'}} className="pp_detalle">Motivo de NO Asignación:</p>
                                <textarea ref={refMot} value={statusMotive} style={{borderBottom:edit ? "solid 1px" : "none", display: 'inline-block'}} autoComplete="none" disabled = {edit ? false : true} rows = "6" className = "label_status pp_status_obs" onChange={onChangeMotive}/>    
                           </div>
                            
                        </div>
                        <div className="half_paper_right">
                            <div>
                                {status_items}
                            </div>
                                {boton_editar}
                        </div>
                            
                    </div>
                </Fade>
            </Modal>
        </>
    );
}*/