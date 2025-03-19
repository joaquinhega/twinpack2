// Menu de Usuarios en Admin
import UserCell from "./UserCell.jsx";
import {useState,useEffect,useContext} from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {useHistory} from "react-router-dom";

const UsersAdmin = () => {
    let history = useHistory();
    const [userToFetch,setUserToFetch] = useState(null);
    const [otherToFetch,setOtherToFetch] = useState(null);
    const [usersEdited,setUsersEdited] = useState([]);

    function traerUsers(){
        let itemsArray;
        var xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function() {
            if (xmlhttp1.readyState===4 && xmlhttp1.status===200) {
                let respuesta1 = xmlhttp1.responseText;
                if(respuesta1 == "Debe iniciar Sesion"){
                    history.push("/");
                }
                itemsArray = JSON.parse(respuesta1);
                setUserToFetch(itemsArray);
            }}
        var cadenaParametros = "";
//        xmlhttp1.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_usuarios.php',true);
        xmlhttp1.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_usuarios.php',true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
        
        return itemsArray;
    }

    function traerOthers(){
        let itemsArrayOthers;
        var xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function() {
            if (xmlhttp1.readyState==4 && xmlhttp1.status==200) {
                let respuesta1 = xmlhttp1.responseText;
                console.log(respuesta1)
                if(respuesta1 == "Debe iniciar Sesion"){
                    history.push("/");
                }
                itemsArrayOthers = JSON.parse(respuesta1);
                console.log(itemsArrayOthers);
                setOtherToFetch(itemsArrayOthers);
            }}
        var cadenaParametros = "";
//        xmlhttp1.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_terceros.php',true);
        xmlhttp1.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_terceros.php',true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
        
        return itemsArrayOthers;
    }

    useEffect( () => {
        traerUsers();
        traerOthers();
    },[]);

    const guardarUsuarios = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Usuarios",JSON.stringify(usersEdited));
        axios
//            .post("https://twinpack.com.ar/sistema/php/guardar_usuarios.php",formData)
            .post("http://localhost/pruebaTwinpack/php/guardar_usuarios.php",formData)
            .then((res) => {
                if(res.data == "Debe iniciar Sesion"){
                    history.push("/");
                }
                toast.success(res.data);
                traerUsers();
                setUsersEdited([]);
            })
            .catch((err) => {
                toast.error("Error!");
            })
    }
    
    return(
        <section>
            <div className="container">
                <div className="div_center">
                    <h4 className="div_center_p">Listado de Usuarios</h4>
                    <input className="searchbar_form_submit" value={"Guardar Cambios"} type="submit" onClick={guardarUsuarios}/>
                </div>
                <table className="responsive-table">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Empresa</th>
                        <th>Razón Social</th>
                        <th>Tipo</th>
                        <th>Cliente/Proveedor</th>
                        <th>Activo</th>
                    </tr>
                    </thead>
                    <tbody>
                        { 
                        userToFetch ? (userToFetch.map((user) => (
                            <UserCell key={user.id} others={otherToFetch} {...user} usersEdited={usersEdited} setUsersEdited={setUsersEdited} />
                        ))): ""
                        }
                    </tbody>
                </table>
                
            </div>
        </section>
    )
}

export default UsersAdmin;