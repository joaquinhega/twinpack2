// Estructura de tabla de los items de una orden
import ProductCell from "./ProductCell";
import {useState, useEffect, useContext} from "react";
import {PaginationContext} from "../contexts/PaginationContext";
import {UserContext} from "../contexts/UserContext";
import {useHistory} from "react-router-dom";
import {useLocation} from "react-router-dom";

const ProductTable = () => {
    const location = useLocation();
    const queryParameters = new URLSearchParams(location.search);
    const idOrden = queryParameters.get("id");
    let history = useHistory();
    const {pagination, setNumberPages} = useContext(PaginationContext);
    const {user} = useContext(UserContext);
    const [productsToFetch, setProductsToFetch] = useState(null);
    const [hasChange, setHasChange] = useState(0);
    const [sortColumn] = useState('id');

    function traerItems() {
        let itemsArray;
        var xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function() {
            if (xmlhttp1.readyState === 4 && xmlhttp1.status === 200) {
                let respuesta1 = xmlhttp1.responseText;
                if (respuesta1 === "Debe iniciar Sesion") {
                    history.push("/");
                }
                itemsArray = JSON.parse(respuesta1);
                setNumberPages(Number(itemsArray[0]));
                setProductsToFetch(itemsArray[1]);
            }
        };
        var cadenaParametros = `Sort=${encodeURIComponent(sortColumn)}&SelectedPage=${encodeURIComponent(pagination.selectedPage)}&idCuenta=${encodeURIComponent(user.idCuenta)}&idOrder=${encodeURIComponent(idOrden)}`;
//        xmlhttp1.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_items.php', true);
        xmlhttp1.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_items.php', true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
        return itemsArray;
    }

    useEffect(() => {
        traerItems();
    }, [pagination.selectedPage, hasChange, sortColumn]);

    function volver() {
        history.push("/dashboard/orders");
    }

    return (
        <section>
            <input className="searchbar_form_submit volver" value={"Volver"} type="submit" onClick={volver} />
            <div className="container-table">
                <p style={{fontWeight: "bold", marginBottom: "30px"}}>Número de Solicitud: {queryParameters.get("s")}</p>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th scope="col" id="responsive-table__stock">Categoria</th>
                            <th scope="col" id="responsive-table__laboratorio">Descripción</th>
                            <th scope="col" id="responsive-table__laboratorio">Numero de Plano</th>                            
                            <th scope="col" id="responsive-table__stock">Cantidad</th>
                            <th scope="col" id="responsive-table__laboratorio">Precio</th>
                            <th scope="col" id="responsive-table__laboratorio">Monto</th>
                            <th scope="col" id="responsive-table__laboratorio">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>{
                            productsToFetch ? productsToFetch.map((product) => (
                                <ProductCell
                                    key={product.id}
                                    id={product.id}
                                    hasChange={hasChange}
                                    setHasChange={setHasChange}
                                    numero_orden={product.numero_orden}
                                    description={product.description}
                                    quantity={product.quantity}
                                    price={product.price}
                                    number={product.number}
                                    fecha_entrega={product.fecha_entrega}
                                    estado={product.estado}
                                    estado_id={product.estado_id}
                                    categoria_nombre={product.categoria_nombre}
                                    observations={product.observations}
                                />
                            )) : ""
                        }
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ProductTable;
