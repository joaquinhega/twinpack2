// Informacion de las celdas en AnimatedModalOrder

import {useState} from "react";
import AnimatedModalOrder from "./AnimatedModalOrder";
import {FaCheck,FaList} from "react-icons/fa";
import {FaDollarSign} from "react-icons/fa";
import {FaCheckDouble} from "react-icons/fa";
import {FaExclamationCircle} from "react-icons/fa";
import {FaPaintBrush} from "react-icons/fa";
import {FaIndustry} from "react-icons/fa";
import {FaCalendarCheck} from "react-icons/fa";
import {useHistory} from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ProductCellOrder = ({hasChange,setHasChange, numero_orden, cliente, monto_total, categoria,proveedor,observaciones,motivo_no_asignacion,fecha_entrega,id,estado,delay,usuario,onEdit, onDelete,}) => {
    const [show,setShow] = useState(false);
    let history = useHistory();

    function getIcon(platformId) {
        switch (platformId) {
            case "Cotizado":
            return <FaDollarSign className="product_image_status"/>
            case "Orden de Compra Emitida":
            return <FaCheckDouble className="product_image_status"/>
            case "Orden NO Asignada":
            return <FaExclamationCircle className="product_image_status"/>
            case "Proceso de Diseño y Desarrollo":
            return <FaPaintBrush className="product_image_status"/>
            case "Producción":
            return <FaIndustry className="product_image_status"/>
            case "Chequeado":
            return <FaCheck className="product_image_status" />;
            default:
            return null
            }
        };

    function getColor(delay) {
        if(delay == 0){
        }
        if (delay === "" || delay === null) {
            return "transparent";
        }
        if (delay <= 0) {
            return "red"
        }
        if (delay <= 5 && delay > 0) {
            return "orange"
        }
        if (delay < 10 && delay > 5) {
            return "#e1da13";
        }
        if (delay >= 10 ){
            return "#74c329";
        } 
        return null
    };


    function openDetail (order_id,s){
        history.push("/dashboard/request?id="+order_id+"&s="+s);
    }
    return(
        <>
            {show &&
            <AnimatedModalOrder show={show} handleClose={() => setShow(false)}
                hasChange={hasChange}
                setHasChange={setHasChange}
                id={id}
                usuario={usuario}
                numero_orden={numero_orden}
                cliente={cliente}
                proveedor={proveedor}
                categoria={categoria}
                monto_total={monto_total}
                fecha_entrega={fecha_entrega}
                observaciones={observaciones}
                motivo_no_asignacion={motivo_no_asignacion}
            />
            } 
            <tr className="product">
                <td data-title="Cantidad" onClick={() => setShow(true)}>{numero_orden}</td>
                <td data-title="Producto" className="product_proveedor" onClick={() => setShow(true)}>{usuario}</td>            
                <td data-title="Producto" className="product_proveedor" onClick={() => setShow(true)}>{cliente}</td>            
                <td data-title="proveedor" className="product_proveedor" onClick={() => setShow(true)}>{proveedor}</td>
                <td data-title="Categoria" className="product_proveedor" onClick={() => setShow(true)}>{categoria}</td>
                <td data-title="Monto" className="product_proveedor" onClick={() => setShow(true)}>{monto_total}</td>
                <td data-title="Estado" className="product_proveedor" onClick={() => setShow(true)}>
                    {estado}
                    {getIcon(estado)}
                </td>
                <td data-title="Fecha" className="product_proveedor" onClick={() => setShow(true)}>
                    {fecha_entrega}
                    <FaCalendarCheck className="product_image_status" style={{color:getColor(delay)}}/>
                </td>
                <td data-title="Acciones" className="product_proveedor" onClick={() => setShow(true)}>
                    <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'nowrap' }}>
                    <FaList
                        className="action-icon"
                        onClick={() => openDetail(id, numero_orden)} // Detalle
                        style={{ width: '28px', height: '28px', cursor: 'pointer', marginRight: '10px' }}
                    />
                    <FaRegEdit
                        className="action-icon"
                        onClick= {onEdit} // Acción de edición
                        style={{ width: '28px', height: '28px', cursor: 'pointer', marginRight: '10px' }}
                    />
                    <MdDelete
                        className="action-icon"
                        onClick={onDelete} // Acción de eliminación
                        style={{ width: '28px', height: '28px', cursor: 'pointer' }}
                    />
                </div>
                </td>

            </tr>
        </>
    )
}

export default ProductCellOrder;