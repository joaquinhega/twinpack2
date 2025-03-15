import Logo from "./../media/logo.jpg";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState} from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPowerOff } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const headerRef = useRef(null);
    const history = useHistory();
    const [isMobileNavbarOn, setIsMobileNavbarOn] = useState(false);
    const [isScrollOn, setIsScrollOn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
                    headerRef.current.classList.add("header_is_fixed");
                    setIsScrollOn(true);
                } else {
                    headerRef.current.classList.remove("header_is_fixed");
                    setIsScrollOn(false);
                }
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const logOut = () => {
        if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            axios
                .get("https://twinpack.com.ar/sistema/php/logout.php")
                .then((res) => {
                    history.push("/");
                })
                .catch((err) => {
                    alert("Hubo un error al cerrar sesión. Intenta de nuevo.");
                });
        } 
    };

    return (
        <>
            <header ref={headerRef} className="header">
                <img src={Logo} alt="Twin Pack" className="header_logo" />
                <nav>
                    <div>
                        <ul>
                            <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                <li>Inicio</li>
                            </Link>
                            <Link to="/dashboard/orders" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                <li>Seguimiento</li>
                            </Link>
                            <Link to="/dashboard/cotizaciones" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                <li>Cotizaciones</li>
                            </Link>
                            <Link to="/dashboard/admin" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                <li>Administración</li>
                            </Link>
                            <li>
                                <button
                                    onClick={logOut}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'inherit',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <FaPowerOff className="header_power" />
                                </button>
                            </li>
                            <span className="header_nav_mobile" onClick={() => setIsMobileNavbarOn(!isMobileNavbarOn)}>
                                <GiHamburgerMenu />
                            </span>
                        </ul>
                    </div>
                </nav>
            </header>
            <div
                className={`header_nav_mobile_body ${isMobileNavbarOn ? 'header_nav_mobile_body_active' : ''} ${isScrollOn ? 'header_nav_mobile_body_active_scroll' : ''}`}
            >
                <div>
                    <ul onClick={() => setIsMobileNavbarOn(!isMobileNavbarOn)}>
                        <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                            <li>Inicio</li>
                        </Link>
                        <Link to="/dashboard/request" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                            <li>Seguimiento</li>
                        </Link>
                        
                            <Link to="/dashboard/admin" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                <li>Administración</li>
                            </Link>
                        <li>
                            <button
                                onClick={logOut}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                }}
                            >
                                Salir
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Header;
