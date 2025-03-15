//Recuperar contraseña

import Logo from "../media/logo.jpg";
import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

const Recover = () => {
    const emailRef = useRef(null);
    const [inputs,setInputs] = useState({
        email: "",
    })

    const onChange = (e) => {
        if(e.target.name === "email" && !(e.target.value.length === 0)){
            emailRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "email" && e.target.value.length === 0){
            emailRef.current.classList.remove("login_form_placeholder_active");
        }
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email",inputs["email"]);
        axios
            .post("php/recuperar_contrasena.php",formData)
            .then((res) => {
                toast.success(res.data);
            })
            .catch((error) => {
                toast.error("Hubo un error mandando el mail!");
            })
    }

    return (
        <section className="login">
            <div className="login_div1">
                <img src={Logo} className="login_image" alt="TrinPack"/>
            </div>
            <div className="login_div2">
                <div className="login_div_form">
                    <h1 className="login_title">Recuperar Contraseña</h1>
                    <form className="login_form" onSubmit={onSubmit}>
                        <div className="login_form_placeholder" ref={emailRef} >
                            <label htmlFor="email">Email</label>
                        </div>
                        <input type="email" autoComplete="off" className="login_form_input" name="email" id="email" onChange={(e) => onChange(e)}/>
                        <input type="submit" value="Recuperar Contraseña" className="login_form_submit"/>
                        <span className="login_form_link"><Link to="/">Iniciar Sesión</Link></span>
                        <span className="login_form_link"><Link to="/register">Crear cuenta</Link></span>
                    </form>
                </div>
            </div >
        </section>
    )
}

export default Recover;