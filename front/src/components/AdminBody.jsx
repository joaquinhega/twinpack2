// Componente que muestra y linkea las secciones de admin.

import {FaStoreAlt, FaIndustry} from "react-icons/fa";
import {FaBox} from "react-icons/fa";
import {FaUserEdit} from "react-icons/fa";
import {Link} from "react-router-dom";

const AdminBody = () => {
    return(
        <div>
            <div className="admin__body">
                <Link to={"/dashboard/admin/users"} style={{color: 'inherit', textDecoration: 'inherit'}}>
                    <div className="admin__body__section">
                        <h3 className="admin__body__section__title">
                            Usuarios
                        </h3>
                        <FaUserEdit className="admin__body__section__logo"/>
                    </div>
                </Link>
                <Link to={"/dashboard/admin/clients"} style={{color: 'inherit', textDecoration: 'inherit'}}>
                    <div className="admin__body__section">
                        <h3 className="admin__body__section__title">
                            Clientes
                        </h3>
                            <FaStoreAlt className="admin__body__section__logo"/>
                    </div>
                </Link>
                <Link to={"/dashboard/admin/suppliers"} style={{color: 'inherit', textDecoration: 'inherit'}}>
                    <div className="admin__body__section">
                        <h3 className="admin__body__section__title">
                            Proveedores
                        </h3>
                            <FaIndustry className="admin__body__section__logo"/>
                    </div>
                </Link>
                <Link to={"/dashboard/admin/categories"} style={{color: 'inherit', textDecoration: 'inherit'}}>
                    <div className="admin__body__section">
                        <h3 className="admin__body__section__title">
                            Categorías
                        </h3>
                            <FaBox className="admin__body__section__logo"/>
                    </div>
                </Link>
            </div>
            <hr></hr>
        </div>
    )
}

export default AdminBody;