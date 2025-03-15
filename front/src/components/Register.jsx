// Registra Usuarios nuevos
import Logo from "./../media/logo.jpg";
import {Link} from "react-router-dom";
import {useState,useRef,useContext} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";

const Register = () => {
    let history = useHistory();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const empresa = useRef(null);
    const razonSocialRef = useRef(null);
    const nombreApellidoContactoRef = useRef(null);
    const telefonoContactoRef = useRef(null);
    const [inputs,setInputs] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        empresa: "",
        razonSocial: "",
        nombreApellidoContacto: "",
        telefonoContacto: ""
    })

    const onChange = (e) => {
        if(e.target.name === "email" && !(e.target.value.length === 0)){
            emailRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "email" && e.target.value.length === 0){
            emailRef.current.classList.remove("login_form_placeholder_active");
        }
        if(e.target.name === "password" && !(e.target.value.length === 0)){
            passwordRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "password" && e.target.value.length === 0){
            passwordRef.current.classList.remove("login_form_placeholder_active");
        }
        if(e.target.name === "confirmPassword" && !(e.target.value.length === 0)){
            confirmPasswordRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "confirmPassword" && e.target.value.length === 0){
            confirmPasswordRef.current.classList.remove("login_form_placeholder_active");
        }
        if(e.target.name === "empresa" && !(e.target.value.length === 0)){
            empresa.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "empresa" && e.target.value.length === 0){
            empresa.current.classList.remove("login_form_placeholder_active");
        }
        if(e.target.name === "razonSocial" && !(e.target.value.length === 0)){
            razonSocialRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "razonSocial" && e.target.value.length === 0){
            razonSocialRef.current.classList.remove("login_form_placeholder_active");
        }
        if(e.target.name === "nombreApellidoContacto" && !(e.target.value.length === 0)){
            nombreApellidoContactoRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "nombreApellidoContacto" && e.target.value.length === 0){
            nombreApellidoContactoRef.current.classList.remove("login_form_placeholder_active");
        }
        if(e.target.name === "telefonoContacto" && !(e.target.value.length === 0)){
            telefonoContactoRef.current.classList.add("login_form_placeholder_active");
        }
        if(e.target.name === "telefonoContacto" && e.target.value.length === 0){
            telefonoContactoRef.current.classList.remove("login_form_placeholder_active");
        }
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })

    }

    const onSubmit = (e) => {
        e.preventDefault();
        for(let field in inputs){
            if(!inputs[field]){
                toast.error("Todos los campos son obligatorioas");
                return "";
            }
        }
        if(inputs["password"] !== inputs["confirmPassword"]){
            toast.error("Las contraseñas no coinciden");
            return "";
        }
        const formData = new FormData();
        formData.append("email", inputs["email"]);
        formData.append("password", inputs["password"]);
        formData.append("empresa",inputs["empresa"]);
        formData.append("razonSocial",inputs["razonSocial"]);
        formData.append("nombreApellidoContacto",inputs["nombreApellidoContacto"]);
        formData.append("telefonoContacto",inputs["telefonoContacto"]);
        axios
            .post("php/guardar_usuario.php",formData)
            .then((res) => {
                console.log("Success!",res);
            })
            .catch((err) => {
                console.log("Error!",err);
            })
        history.push("/confirm");
    }

    return(
        <section className="login">
            <div className="login_div1">
                <img src={Logo} className="login_image" alt="TwinPack"/>
            </div>
            <div className="login_div2">
                <div className="login_div_form">
                    <h1 className="login_title">Registrarse</h1>
                    <form className="login_form" onSubmit={onSubmit}>
                        <div className="login_form_placeholder" ref={emailRef} >
                            <label htmlFor="email">Email</label>
                        </div>
                        <input type="email" autoComplete="off" className="login_form_input" name="email" id="email" onChange={(e) => onChange(e)}/>
                            <div className="double_row">
                                <div style={{"marginRight": "20px"}}>
                                    <div className="login_form_placeholder" ref={passwordRef} >
                                        <label htmlFor="email">Contraseña</label>
                                    </div>
                                    <input type="password" autoComplete="none" className="login_form_input" name="password" id="password" onChange={(e) => onChange(e)}/>
                                </div>
                                <div>
                                    <div className="login_form_placeholder" ref={confirmPasswordRef} >
                                        <label htmlFor="email">Confirmar Contraseña</label>
                                    </div>
                                    <input type="password" autoComplete="none" className="login_form_input"  name="confirmPassword" id="confirmPassword" onChange={(e) => onChange(e)}/>
                                </div>
                            </div>
                            <div className="login_form_placeholder" ref={empresa} >
                                <label htmlFor="email">Empresa</label>
                            </div>
                            <input type="text" autoComplete="none" className="login_form_input"  name="empresa" id="empresa" onChange={(e) => onChange(e)}/>
                            <div className="login_form_placeholder" ref={razonSocialRef} >
                                <label htmlFor="email">Razón Social</label>
                            </div>
                            <input type="text" autoComplete="none" className="login_form_input"  name="razonSocial" id="razonSocial" onChange={(e) => onChange(e)}/>
                            <div className="login_form_placeholder" ref={nombreApellidoContactoRef} >
                                <label htmlFor="email">Nombre Contacto</label>
                            </div>
                            <input type="text" autoComplete="none" className="login_form_input"  name="nombreApellidoContacto" id="nombreApellidoContacto" onChange={(e) => onChange(e)}/>
                            <div className="login_form_placeholder" ref={telefonoContactoRef} >
                                <label htmlFor="email">Teléfono Contacto</label>
                            </div>
                            <input type="number" autoComplete="none" className="login_form_input"  name="telefonoContacto" id="telefonoContacto" onChange={(e) => onChange(e)}/>
                            <input type="submit" value="Registrarse" className="login_form_submit"/>
                            <span className="login_form_link"><Link to="/">¿Ya tienes una cuenta? Inicia Sesión</Link></span>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Register;