import React, { useState, useContext, useEffect } from "react";
import { PaginationContext } from "../contexts/PaginationContext";
import SearchBarOrder from "./SearchBarOrder";
import ProductTableOrder from "./ProductTableOrder";
import FiltrosModal from "./filtrosModal";

const Request = () => {
    const { clearPagination } = useContext(PaginationContext);
    const [input, setInput] = useState({
        search: "",
        filter: "proveedor",
    });
    const [selectedEstado, setSelectedEstado] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState([]);
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [isFiltrosModalOpen, setIsFiltrosModalOpen] = useState(false);

    const onChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
    }, [selectedEstado, selectedCategoria, fechaDesde, fechaHasta]);
    
    const onSubmit = (e) => {
        e.preventDefault();
        clearPagination();
    };

    const handleApplyFilters = (estado, categoria, desde, hasta) => {
        setSelectedEstado(estado);
        setSelectedCategoria(categoria);
        setFechaDesde(desde);
        setFechaHasta(hasta);
        setIsFiltrosModalOpen(false);
    };

    const handleSearchClientsOrProviders = (searchValue) => {
        setInput({
            ...input,
            search: searchValue,
        });
    };

    const handleOpenFiltrosModal = () => {
        setIsFiltrosModalOpen(true);
    };

    const handleCloseFiltrosModal = () => {
        setIsFiltrosModalOpen(false);
    };

    return (
        <section className="store">
            <SearchBarOrder
                onSubmit={onSubmit}
                onChange={onChange}
                input={input}
                onApplyFilters={handleApplyFilters}
                onSearchClientsOrProviders={handleSearchClientsOrProviders}
                onOpenFiltrosModal={handleOpenFiltrosModal}
                onCloseFiltrosModal={handleCloseFiltrosModal}
                showFiltrosModal={isFiltrosModalOpen}
            />
            <hr />
            {isFiltrosModalOpen && (
                <FiltrosModal
                    onApplyFilters={handleApplyFilters}
                    onClose={handleCloseFiltrosModal}
                    initialSelectedEstado={selectedEstado}
                    initialSelectedCategoria={selectedCategoria}
                    initialFechaDesde={fechaDesde}
                    initialFechaHasta={fechaHasta}
                />
            )}
            <ProductTableOrder
                input_search={input}
                selectedEstado={selectedEstado}
                selectedCategoria={selectedCategoria}
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
            />
        </section>
    );
};

export default Request;