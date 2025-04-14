import React, { useState, useEffect, useContext } from "react";
import ProductCellOrder from "./ProductCellOrder";
import { PaginationContext } from "../contexts/PaginationContext";
import { UserContext } from "../contexts/UserContext";
import { FaSortAlphaDown } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const ProductTableOrder = ({ input_search, selectedEstado, selectedCategoria, fechaDesde, fechaHasta }) => {
    const { pagination, setNumberPages } = useContext(PaginationContext);
    const { user } = useContext(UserContext);
    const history = useHistory();
    const [productsToFetch, setProductsToFetch] = useState([]);
    const [sortColumn, setSortColumn] = useState("id");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    function traerItems() {
        var xmlhttp1 = new XMLHttpRequest();
        xmlhttp1.onreadystatechange = function () {
            if (xmlhttp1.readyState === 4) {
                if (xmlhttp1.status === 200) {
                    try {
                        let itemsArray = JSON.parse(xmlhttp1.responseText);
                        setNumberPages(Number(itemsArray.numberPages));
                        setProductsToFetch(itemsArray.items);
                        console.log("response", itemsArray.items);
                    } catch (error) {
                        console.error("Error al analizar JSON:", error);
                    }
                } else {
                    console.error("Error del servidor:", xmlhttp1.status, xmlhttp1.responseText); 
                }
            }
        };
        var cadenaParametros = `Sort=${encodeURIComponent(sortColumn)}&Search=${encodeURIComponent(input_search.search)}&Filter=${encodeURIComponent(input_search.filter)}&SelectedPage=${encodeURIComponent(pagination.selectedPage)}&idCuenta=${encodeURIComponent(user.idCuenta)}`;
        xmlhttp1.open('POST', 'https://twinpack.com.ar/sistema/php/buscar_itemsOrden.php', true);
//        xmlhttp1.open('POST', 'http://localhost/pruebaTwinpack/php/buscar_itemsOrden.php', true);
        xmlhttp1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp1.send(cadenaParametros);
    }

    function sortTable(colum_sort) {
        setSortColumn(colum_sort);
    }

    useEffect(() => {
        traerItems();
    }, [input_search, pagination.selectedPage, sortColumn]);

    const paginatedProducts = (products) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filteredProducts = selectedEstado.length
        ? productsToFetch.filter((product) => selectedEstado.includes(product.estado))
        : productsToFetch;

    const filteredByCategoria = filteredProducts.filter((product) => {
        return selectedCategoria.length
            ? selectedCategoria.includes(product.categoria)
            : true;
    });

    const filteredByFecha = filteredByCategoria.filter((product) => {
        const productDate = new Date(product.fecha_entrega);
    
        const desdeDate = fechaDesde ? new Date(fechaDesde) : null;
        const hastaDate = fechaHasta ? new Date(fechaHasta) : null;
        if (desdeDate && hastaDate) {
            return productDate >= desdeDate && productDate <= hastaDate;
        } else if (desdeDate) {
            return productDate >= desdeDate;
        } else if (hastaDate) {
            return productDate <= hastaDate;
        } else {
            return true;
        }
    });

    const filteredBySearch = filteredByFecha.filter((product) => {
        const searchValue = input_search.search.toLowerCase();
        return product.cliente.toLowerCase().includes(searchValue) || product.proveedor.toLowerCase().includes(searchValue);
    });

    const handleEdit = (productId) => {
        history.push({
            pathname: `/dashboard/editquotation/${productId}`,
            state: { from: "ProductTableOrder" }, 
        });    };
    
    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la orden ${productId}?`);
        if (confirmDelete) {
            try {
                const response = await axios.post(
                    'https://twinpack.com.ar/sistema/php/eliminar_orden.php',
//                    'http://localhost/pruebaTwinpack/php/eliminar_orden.php',
                    new URLSearchParams({ id: productId })
                );
                if (response.data.status === "success") {
                    toast.success(`Orden ${productId} eliminado correctamente`);
                    traerItems(); 
                } else {
                    toast.error("Error al eliminar la orden");
                }
            } catch (error) {
                console.error("Error al eliminar la orden:", error);
                toast.error("Error al eliminar la orden");
            }
        }
    };

    const displayedProducts = paginatedProducts(filteredBySearch);

    return (
        <section>
            <div className="container">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th scope="col" id="responsive-table__cantidad">Nº Solicitud<FaSortAlphaDown onClick={() => sortTable('id')} className="sort_icon"></FaSortAlphaDown></th>
                            <th scope="col" id="responsive-table__proveedor">Usuario</th>
                            <th scope="col" id="responsive-table__nombreComercial">Cliente</th>
                            <th scope="col" id="responsive-table__proveedor">Proveedor</th>
                            <th scope="col" id="responsive-table__proveedor">Categoría</th>
                            <th scope="col" id="responsive-table__proveedor">Monto</th>
                            <th scope="col" id="responsive-table__suDescuento">Estado<FaSortAlphaDown onClick={() => sortTable('estado_id')} className="sort_icon"></FaSortAlphaDown></th>
                            <th scope="col" id="responsive-table__precio">Entrega Estimada<FaSortAlphaDown onClick={() => sortTable('fecha_solicitud')} className="sort_icon"></FaSortAlphaDown></th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedProducts.length > 0 ? (
                            displayedProducts.map((product) => (
                                <ProductCellOrder
                                    key={product.id}
                                    id={product.id}
                                    numero_orden={product.numero_orden}
                                    usuario={product.usuario}
                                    cliente={product.cliente}
                                    proveedor={product.proveedor}
                                    categoria={product.categoria}
                                    monto_total={product.monto_total}
                                    estado={product.estado}
                                    fecha_entrega={product.fecha_entrega}
                                    observaciones={product.observaciones}
                                    delay={product.delay}
                                    onEdit={() => handleEdit(product.id)}
                                    onDelete={() => handleDelete(product.id)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No hay productos disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination-controls">
                    {Array.from({ length: Math.ceil(filteredBySearch.length / itemsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductTableOrder;