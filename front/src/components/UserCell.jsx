//Tabla de usuario en Admin

import {useState,useEffect,useRef} from "react";

const UserCell = ({id,nombre,mail,empresa,razon_social,tipo,tipo_id,tercero,activo,others,usersEdited,setUsersEdited}) => {

const [typeToFetch, setTypeToFetch] = useState(tipo)
const [type_idToFetch, setTypeIDToFetch] = useState(tipo_id)
const [terceroToFetch, setTerceroToFetch] = useState(tercero)
const [activoToFetch, setActivoToFetch] = useState(activo)
const isFirstRender = useRef(true);

const changeType = function(event){
    setTypeToFetch(event.target.value);
    if(event.target.value === 'administrador'){
        setTypeIDToFetch(1)
    }
    if(event.target.value === 'cliente'){
        setTypeIDToFetch(2)
    }
    if(event.target.value === 'proveedor'){
        setTypeIDToFetch(3);
    }
    setTerceroToFetch("");
}

const changeTercero = function(event){
    setTerceroToFetch(event.target.value);
}

const changeActivo = function(event){
    setActivoToFetch(event.target.checked ? "1" : "0");
}

function EditUser(){
    let edited_user = {
        id: id,
        tipo_id: type_idToFetch,
        tercero: terceroToFetch,
        activo: activoToFetch
    }
    let new_edited_users = [...usersEdited]
    let edited_user_index = usersEdited.findIndex(user => user.id === id);
    if (edited_user_index!==-1) {
        new_edited_users[edited_user_index] = edited_user;
    } else {
        new_edited_users.push(edited_user);
    }
    setUsersEdited(new_edited_users)
}

useEffect( () => {
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return; 
      }
    EditUser();
},[type_idToFetch,terceroToFetch,activoToFetch]);

    return(
            <tr className="product">
                <td>{nombre}</td>
                <td>{mail}</td>
                <td>{empresa}</td>
                <td>{razon_social}</td>
                <td>
                    <select value={typeToFetch} onChange={changeType}>
                        <option value=""></option>
                        <option value="administrador">Administrador</option>
                        <option value="cliente">Cliente</option>
                        <option value="proveedor">Proveedor</option>
                    </select>
                </td>
                <td>
                    <select value={terceroToFetch} onChange={changeTercero}>
                    <option value=""></option>
                    {       
                        
                        others ? (others.filter(other => other.tipo_other == type_idToFetch).map((other) => (
                            <option key={others.id_other} value={other.tercero}>{other.tercero}</option>
                        ))): ""
                    }
                    </select>
                </td>
                <td>
                    <div>
                        <label class="switch">
                            <input type="checkbox" checked={parseInt(activoToFetch)} onChange={changeActivo}></input>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </td>
            </tr>
    )
}

export default UserCell;