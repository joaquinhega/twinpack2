// Seccion de proveedores en Admin

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SuppliersAdmin = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    let history = useHistory();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const onChangeNewSupplier = (event) => {
        setNewSupplier(event.target.value || "");
    };

    const fetchSuppliers = async () => {
        const response = await fetch('https://twinpack.com.ar/sistema/php/buscar_terceros.php');
        const data = await response.json();
        if (data === "Debe iniciar Sesion") {
        history.push("/");
        } else {
        setSuppliers(data.filter(supplier => supplier.tipo_other === 3)); 
        }
    };

    const handleAddSupplier = async () => {
        if (newSupplier) {
        const response = await fetch('https://twinpack.com.ar/sistema/php/guardar_proveedor.php', {
            method: 'POST',
            body: new URLSearchParams({
            Proveedor: newSupplier,
            }),
        });
        const result = await response.text();
        if (result === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            toast.success(result);
            fetchSuppliers();
            setNewSupplier("");
        }
        }
    };

    const handleEditSupplier = async (supplierId) => {
        const newSupplierData = prompt("Ingresa los nuevos datos para el proveedor");
        if (newSupplierData) {
        const response = await fetch('https://twinpack.com.ar/sistema/php/editar_proveedor.php', {
            method: 'POST',
            body: new URLSearchParams({
            id: supplierId,
            newData: newSupplierData,
            }),
        });
        const result = await response.text();
        if (result === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            toast.success(result);
            fetchSuppliers();
        }
        }
    };

    const handleDeleteSupplier = async (supplierId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este proveedor?");
        if (confirmDelete) {
        const response = await fetch('https://twinpack.com.ar/sistema/php/eliminar_proveedor.php', {
            method: 'POST',
            body: new URLSearchParams({
            id: supplierId,
            }),
        });
        const result = await response.text();
        if (result === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            toast.success(result);
            fetchSuppliers();
        }
        }
    };

    const paginatedSuppliers = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return suppliers.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <section>
        <div className="container">
            <div className="container-addbar">
            <input
                type="text"
                value={newSupplier}
                onChange={onChangeNewSupplier}
                placeholder="Nuevo Proveedor"
            />
            <button className="searchbar_form_submit" onClick={handleAddSupplier}>
                Agregar
            </button>
            </div>
            <div className="categories-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {paginatedSuppliers()
                .filter(supplier => supplier.tercero.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(supplier => (
                    <tr key={supplier.id}>
                    <td>{supplier.id}</td>
                    <td>{supplier.tercero}</td>
                    <td>
                        <div style={{ display: 'flex', gap: '1px' }}>
                        <FaRegEdit
                            className="action-icon"
                            onClick={() => handleEditSupplier(supplier.id)}
                            style={{  display:'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px' , backgroundColor: '#4893e9', borderRadius: '5px' ,cursor: 'pointer', marginRight: '7px' }}
                        />
                        <MdDelete
                            className="action-icon"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            style={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', backgroundColor: '#D9534F', borderRadius: '5px',cursor: 'pointer' }}
                            />
                        </div>
                    </td>
                    </tr>
                ))}
            </tbody>
            </div>
            <div className="pagination-controls">
            {Array.from({ length: Math.ceil(suppliers.length / itemsPerPage) }, (_, index) => (
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

export default SuppliersAdmin;