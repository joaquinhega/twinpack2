import React from "react";
import { Route, Switch, useRouteMatch, useLocation, useHistory } from "react-router-dom";
import Header from "./Header";
import Request from "./Request";
import Store from "./Store";
import OrdersAdmin from "./OrdersAdmin";
import Admin from "./Admin";
import NewQuotation from "./newQuotation";
import AddProduct from "./AddProduct";
import OrderDetailModal from "./OrderDetailModal";
import EditProduct from "./EditProduct";
import Presupuesto from "./Presupuesto";
import EditQuotation from "./EditQuotation";

const Dashboard = () => {
    let { path } = useRouteMatch();
    const location = useLocation();
    const history = useHistory();
    const { reopenModal, orderId } = location.state || {};

    return (
            <div className="dashboard">
            <Header />
                <Switch>
                    <Route exact path={`${path}`}>
                        <div className="dashboard_div">
                            <div className="dashboard_text">
                                <p className="dashboard_t">Bienvenido al sistema TWINPACK donde podrás solicitar cotizaciones, hacer seguimiento y mantener toda la información en un solo lugar.</p>
                            </div>
                        </div>
                    </Route>
                    <Route path={`${path}/orders`}>
                        <Request />
                    </Route>
                    <Route path={`${path}/request`}>
                        <Store />
                    </Route>
                    <Route path={`${path}/cotizaciones`}>
                        <OrdersAdmin />
                        {reopenModal && (
                            <OrderDetailModal
                                order={{ id: orderId }}
                                onClose={() => {
                                    history.replace({
                                        pathname: `${path}/cotizaciones`,
                                        state: { reopenModal: false },
                                    });
                                }}
                            />
                        )}
                    </Route>
                    <Route path={`${path}/editproduct`}>
                        <EditProduct />
                    </Route>
                    <Route path={`${path}/admin`}>
                        <Admin />
                    </Route>
                    <Route path={`${path}/newquotation`}>
                        <NewQuotation />
                    </Route>
                    <Route path={`${path}/addproduct`}>
                        <AddProduct />
                    </Route>
                    <Route path={`${path}/presupuesto`}>
                        <Presupuesto />
                    </Route>
                    <Route path={`${path}/editquotation/:orderId`}>
                        <EditQuotation />
                    </Route>
                </Switch>
        </div>
    );
};

export default Dashboard;