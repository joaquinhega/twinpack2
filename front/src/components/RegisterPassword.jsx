// gestiona la contraseña del futuro usuario
import Logo from "./../media/logo.jpg";
import {Link, useHistory} from "react-router-dom";
import {useRef, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

const RegisterConfirm = () => {
    let history = useHistory();
    const passwordRef = useRef(null);
    const repasswordRef = useRef(null);
    let token = window.location.hash.split('?code=')[1];
    const [inputs,setInputs] = useState({
        password: "",
        repassword: ""
    })

    const onChange = (e) => {
        if(e.target.name === "password" && !(e.target.value.length === 0)){
            passwordRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "password" && e.target.value.length === 0){
            passwordRef.current.classList.remove("login_form_placeholder_active");
        }
        if(e.target.name === "repassword" && !(e.target.value.length === 0)){
            repasswordRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "repassword" && e.target.value.length === 0){
            repasswordRef.current.classList.remove("login_form_placeholder_active");
        }
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })

    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(inputs["password"] !== inputs["repassword"]){
            toast.error("Las contraseñas no coinciden");
            return;
        }
        const formData = new FormData();
        formData.append("password",inputs["password"]);
        formData.append("token",token);
        axios
            .post("https://twinpack.com.ar/sistema/php/cambiar_clave.php",formData)
//            .post("http://localhost/pruebaTwinpack/php/cambiar_clave.php",formData)
            .then((res) => {
                console.log("Success!",res.data);
                toast.info(res.data);
                history.push("/");
            })
            .catch((err) => {
                console.log("Error!",err);
                toast.error(err);
            })
    }

    return(
        <section className="login">
            <div className="login_div1">
                <img src={Logo} className="login_image" alt="logo"/>
            </div>
            <div className="login_div2">
                <div className="login_div_form">
                    <h1 className="login_title">Cambio de Contraseña</h1>
                    <form className="login_form" onSubmit={onSubmit}>
                        <div className="login_form_placeholder" ref={passwordRef} >
                            <label htmlFor="password">Nueva contraseña</label>
                        </div>
                        <input type="password" autoComplete="off" className="login_form_input" name="password" id="password" onChange={(e) => onChange(e)}/>
                        
                        <div className="login_form_placeholder login_form_placeholder_password" ref={repasswordRef}>
                            <label htmlFor="repassword">Repetir contraseña</label>
                        </div>
                        <input type="password" className="login_form_input" name="repassword" id="repassword" onChange={(e) => onChange(e) } autoComplete="off"/>
                        <input type="submit" value="Cambiar" className="login_form_submit"/>
                        <span className="login_form_link"><Link to="/">Iniciar Sesión</Link></span>
                    </form>
                </div>
            </div >
        </section>
    )
}


export default RegisterConfirm;