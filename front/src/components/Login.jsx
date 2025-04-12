import Logo from "./../media/logo.jpg";
import { Link, useHistory } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
    let history = useHistory();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const {setUser } = useContext(UserContext);
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const onChange = (e) => {
        if (e.target.name === "email" && !(e.target.value.length === 0)) {
            emailRef.current.classList.add("login_form_placeholder_active");
        }

        if (e.target.name === "email" && e.target.value.length === 0) {
            emailRef.current.classList.remove("login_form_placeholder_active");
        }

        if (e.target.name === "password" && !(e.target.value.length === 0)) {
            passwordRef.current.classList.add("login_form_placeholder_active");
        }

        if (e.target.name === "password" && e.target.value.length === 0) {
            passwordRef.current.classList.remove("login_form_placeholder_active");
        }

        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    };

    // Maneja el envío del formulario
    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", inputs.email);
        formData.append("password", inputs.password);

        axios
//            .post("https://twinpack.com.ar/sistema/php/iniciar_sesion.php", formData)
                .post("http://localhost/pruebaTwinpack/php/iniciar_sesion.php", formData)
                .then((res) => {
                if (res.data && !res.data.error) {
                    // Verifica si la respuesta del servidor es exitosa
                    toast.success("Bienvenido!");
                    
                    // Actualiza el estado global del usuario
                    setUser({
                        token: res.data["token_actualizado"],
                        nombre: res.data["nombre"],
                        correo: res.data["mail"],
                        tipo: res.data["tipo"],
                        proveedor_id: res.data["proveedor_id"],
                        cliente_id: res.data["cliente_id"],
                        id: res.data["id"]
                    });
                    // Almacena los datos del usuario en localStorage para persistencia
                    localStorage.setItem("user", JSON.stringify({
                        token: res.data["token_actualizado"],
                        nombre: res.data["nombre"],
                        correo: res.data["mail"],
                        tipo: res.data["tipo"],
                        proveedor_id: res.data["proveedor_id"],
                        cliente_id: res.data["cliente_id"],
                        id: res.data["id"]
                    }));

                    // Redirige al Dashboard
                    history.push("/dashboard");
                } else {
                    toast.error(res.data.error || "Usuario o contraseña incorrecta");
                }
            })
            .catch((err) => {
                toast.error("Algo ha salido mal!", err);
            });
    };

    return (
        <section className="login">
            <div className="login_div1">
                <img src={Logo} className="login_image" alt="logo" />
            </div>
            <div className="login_div2">
                <div className="login_div_form">
                    <h1 className="login_title">Ingresar</h1>
                    <form className="login_form" onSubmit={onSubmit}>
                        <div className="login_form_placeholder" ref={emailRef}>
                            <label htmlFor="email">Email</label>
                        </div>
                        <input
                            type="email"
                            autoComplete="on"
                            className="login_form_input"
                            name="email"
                            id="email"
                            onChange={(e) => onChange(e)}
                        />
                        <div className="login_form_placeholder login_form_placeholder_password" ref={passwordRef}>
                            <label htmlFor="password">Contraseña</label>
                        </div>
                        <input
                            type="password"
                            className="login_form_input"
                            name="password"
                            id="password"
                            onChange={(e) => onChange(e)}
                            autoComplete="off"
                        />
                        <input type="submit" value="Iniciar Sesión" className="login_form_submit" />
                        <span className="login_form_link">
                            <Link to="/recover">Olvidé mi contraseña</Link>
                        </span>
                        <span className="login_form_link">
                            <Link to="/register">Crear cuenta</Link>
                        </span>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
