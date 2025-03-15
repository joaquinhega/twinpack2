import { useState, useEffect } from "react";
import FiltrosModal from "./filtrosModal"; 

const SearchBarOrder = ({ onSubmit, onApplyFilters, onSearchClientsOrProviders, onOpenFiltrosModal, onCloseFiltrosModal, showFiltrosModal }) => {
    const [localShowFiltrosModal, setLocalShowFiltrosModal] = useState(showFiltrosModal);

    useEffect(() => {
        setLocalShowFiltrosModal(showFiltrosModal);
    }, [showFiltrosModal]);

    const handleOpenFiltrosModal = () => {  
        console.log("Opening FiltrosModal");
        setLocalShowFiltrosModal(true);
        onOpenFiltrosModal();
    };

    const handleCloseFiltrosModal = () => {   
        console.log("Closing FiltrosModal");
        setLocalShowFiltrosModal(false);
        onCloseFiltrosModal();
    };

    const handleApplyFilters = (estado, categorias, desde, hasta) => {
        console.log("Applying filters in SearchBarOrder:");
        console.log("Estados:", estado);
        console.log("Categorias:", categorias);
        console.log("Fecha Desde:", desde);
        console.log("Fecha Hasta:", hasta);
        onApplyFilters(estado, categorias, desde, hasta); 
        handleCloseFiltrosModal();
    };

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        onSearchClientsOrProviders(searchValue);
    };

    return (
        <div className="searchbar">
            <form className="searchbar_form" onSubmit={onSubmit}>
                <div>
                    <input 
                        className="searchbar_form_input" 
                        name="search" 
                        type="text" 
                        autoComplete="off" 
                        placeholder={`Buscar Cliente o Proveedor`} 
                        onChange={handleSearch} 
                    />
                    <button type="button" className="searchbar_form_submit" onClick={handleOpenFiltrosModal}>
                        Filtros
                    </button>
                </div>
            </form>
            {localShowFiltrosModal && <FiltrosModal onClose={handleCloseFiltrosModal} onApplyFilters={handleApplyFilters} />}
            {console.log("localShowFiltrosModal:", localShowFiltrosModal)}
        </div>
    );
};

export default SearchBarOrder;