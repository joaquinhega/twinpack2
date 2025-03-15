// Maneja la busqueda de clientes y proveedores en SearchbarOrder
import { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import SearchBarOrder from "./SearchBarOrder";

const Store = () => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchClientsOrProviders = (searchValue) => {
        setSearchValue(searchValue); 
    };

    useEffect(() => {
        console.log("Componente Store refrescado!");
    }, []);

    return (
        <section className="store">
            <SearchBarOrder 
                onSearchClientsOrProviders={handleSearchClientsOrProviders} 
                input={{ search: searchValue, filter: "Clientes o Proveedores" }} 
                onSubmit={(e) => e.preventDefault()} 
            />
            <hr />
            <ProductTable input_search={{ search: searchValue, filter: "Clientes o Proveedores" }} />
        </section>
    );
};

export default Store;
