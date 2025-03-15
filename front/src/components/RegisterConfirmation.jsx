// Mensaje de confirmacion al registraste
import Logo from "./../media/logo.jpg";
import {Link} from "react-router-dom";

const RegisterConfirmation = () => {

    return(
        <section className="login">
            <div className="login_div1">
                <img src={Logo} className="login_image" alt="TwinPack"/>
            </div>
            <div className="login_div2">
            <div className="login_div_form">
                <h1 className="login_title">Hemos recibido su Registro</h1>
                <p className="pp_register">Hemos recibido su registro correctamente.</p>
                <p className="pp_register">El Administrador del Sistema verificará los datos y se le enviará un correo cuando su usuario esté activo.</p>
                <p className="pp_register" >Gracias por registrarse en TwinPack</p>
                <Link to="/">
                    <input type="submit" value="Volver al Inicio" className="login_form_submit"/>
                </Link>
            </div>
            </div>
        </section>
    )
}


export default RegisterConfirmation;