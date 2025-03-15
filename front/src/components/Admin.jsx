// Gestiona el panel de administración, mostrando diferentes secciones mediante rutas dinámicas.
import AdminTitle from "./AdminTitle";
import AdminBody from "./AdminBody";
import UsersAdmin from "./UsersAdmin";
import {Switch,Route} from "react-router-dom";
import ClientsAdmin from "./ClientsAdmin";
import SuppliersAdmin from "./SuppliersAdmin";
import CategoriesAdmin from "./CategoriesAdmin";

const Admin = () => {
    return(
        <section className="admin">
            <AdminTitle/>
            <AdminBody/>
            <Switch>
                <Route path="/dashboard/admin/users">
                    <UsersAdmin/>
                </Route>
                <Route path="/dashboard/admin/clients">
                    <ClientsAdmin/>
                </Route>
                <Route path="/dashboard/admin/suppliers">
                    <SuppliersAdmin/>
                </Route>
                <Route path="/dashboard/admin/categories">
                    <CategoriesAdmin/>
                </Route>
            </Switch>
        </section>
    )
}

export default Admin;