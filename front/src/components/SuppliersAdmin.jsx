// Seccion de proveedores en Admin

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SuppliersAdmin = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState("");
    const [newSupplierLogo, setNewSupplierLogo] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null); 
    const [editingSupplierLogo, setEditingSupplierLogo] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
    const [previewLogo, setPreviewLogo] = useState(null);
    const itemsPerPage = 10;

    let history = useHistory();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const onChangeNewSupplier = (event) => {
        setNewSupplier(event.target.value || "");
    };

    const onChangeNewSupplierLogo = (event) => {
        setNewSupplierLogo(event.target.files[0] || null);
    };

    const fetchSuppliers = async () => {
        const response = await fetch('https://twinpack.com.ar/sistema/php/buscar_terceros.php');
//        const response = await fetch('http://localhost/pruebaTwinpack/php/buscar_terceros.php');
        const data = await response.json();
        if (data === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            setSuppliers(data.filter(supplier => supplier.tipo_other === 3)); 
        }
    };

    const handleAddSupplier = async () => {
        if (newSupplier) {
            const formData = new FormData();
            formData.append("Proveedor", newSupplier);
            if(newSupplierLogo){
                formData.append("Logo", newSupplierLogo);
            } 

            const response = await fetch('https://twinpack.com.ar/sistema/php/guardar_proveedor.php', {
//                const response = await fetch('http://localhost/pruebaTwinpack/php/guardar_proveedor.php', {
                    method: 'POST',
                body: formData,
            });
            const resultado = await response.text();
            if (resultado === "Debe iniciar Sesion") {
                history.push("/");
            } else {
                toast.success(resultado);
                fetchSuppliers();
                setNewSupplier("");
                setNewSupplierLogo(null);
                setIsModalOpen(false);
            }
        } else {
            toast.error("Por favor, complete todos los campos.");
        }
    };

    const handleEditSupplierSubmit = async () => {
        if (editingSupplier) {
            const formData = new FormData();
            formData.append("id", editingSupplier.id);
            formData.append("newData", editingSupplier.tercero);
    
            console.log("Inicio del proceso de edición del proveedor.");
            console.log("ID del proveedor:", editingSupplier.id);
            console.log("Nuevo nombre del proveedor:", editingSupplier.tercero);
    
            if (editingSupplierLogo) {
                formData.append("Logo", editingSupplierLogo);
                console.log("Logo cargado para el proveedor:", editingSupplierLogo);
            } else {
                console.log("No se cargó un nuevo logo.");
            }
    
            try {
                console.log("Enviando solicitud de edición del proveedor...");
                const respon = await fetch('https://twinpack.com.ar/sistema/php/editar_proveedor.php', {
                    method: 'POST',
                    body: formData,
                });
    
                const resultado = await respon.text();
                console.log("Respuesta del servidor:", resultado);
    
                if (resultado === "Debe iniciar Sesion") {
                    history.push("/");
                } else {
                    toast.success(resultado);
                    fetchSuppliers();
                    setPreviewLogo(null);
                    closeEditModal();
                }
            } catch (error) {
                console.error("Error al enviar la solicitud de edición del proveedor:", error);
                toast.error("Error al editar el proveedor.");
            }
        } else {
            toast.error("Por favor, complete todos los campos.");
        }
    };

    const handleDeleteSupplier = async (supplierId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este proveedor?");
        if (confirmDelete) {
            const response = await fetch('https://twinpack.com.ar/sistema/php/eliminar_proveedor.php', {
//                const response = await fetch('http://localhost/pruebaTwinpack/php/eliminar_proveedor.php', {
                    method: 'POST',
                body: new URLSearchParams({
                    id: supplierId,
                }),
            });
            const resultado = await response.text();
            if (resultado === "Debe iniciar Sesion") {
                history.push("/");
            } else {
                toast.success(resultado);
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewSupplier("");
        setNewSupplierLogo(null);
    };
    const openEditModal = (supplier) => {
        setEditingSupplier(supplier);
        setEditingSupplierLogo(null);
        setPreviewLogo(null);
        setIsEditModalOpen(true);
    };
    
    const closeEditModal = () => {
        setEditingSupplier(null);
        setEditingSupplierLogo(null);
        setPreviewLogo(null);
        setIsEditModalOpen(false);
    };

    return (
        <section>
            <div className="container">
                <div className="container-addbar">
                    <button className="searchbar_form_submit" onClick={openModal}>
                        Agregar Proveedor
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
                                                onClick={() => openEditModal(supplier)}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '32px',
                                                    height: '32px',
                                                    backgroundColor: '#4893e9',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    marginRight: '7px',
                                                }}
                                            />
                                            <MdDelete
                                                className="action-icon"
                                                onClick={() => handleDeleteSupplier(supplier.id)}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '32px',
                                                    height: '32px',
                                                    backgroundColor: '#D9534F',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                }}
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
    
            {/* Modal para agregar proveedor */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2 className="modal-title">Agregar Proveedor</h2>
                        <form>
                            <div className="modal-section">
                                <label>Nombre del Proveedor:</label>
                                <input
                                    type="text"
                                    value={newSupplier}
                                    onChange={onChangeNewSupplier}
                                    placeholder="Nombre del Proveedor"
                                    className="modal-input"
                                />
                            </div>
                            <div className="modal-section">
                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={onChangeNewSupplierLogo}
                                    className="modal-input"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={handleAddSupplier} className="modal-button">
                                    Agregar
                                </button>
                                <button type="button" onClick={closeModal} className="modal-button-cancel">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    
            {/* Modal para editar proveedor */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditModal}>
                            &times;
                        </span>
                        <h2 className="modal-title">Editar Proveedor</h2>
                        <form>
                            <div className="modal-section">
                                <label>Nombre del Proveedor:</label>
                                <input
                                    type="text"
                                    value={editingSupplier?.tercero || ""}
                                    onChange={(e) =>
                                        setEditingSupplier({
                                            ...editingSupplier,
                                            tercero: e.target.value,
                                        })
                                    }
                                    placeholder="Nombre del Proveedor"
                                    className="modal-input"
                                />
                            </div>
                            <div className="modal-section">
                                {editingSupplier?.logo && (
                                    <div className="current-logo">
                                        <p>Logo actual:</p>
                                        <img
                                            src={`https://twinpack.com.ar/sistema/php/logos/${editingSupplier.logo}`}
                                            alt="Logo del proveedor"
                                            style={{ maxWidth: '100px', marginBottom: '10px' }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={(e) => {
                                        const file = e.target.files[0]; 
                                        setEditingSupplierLogo(e.target.files[0])
                                        setPreviewLogo(file ? URL.createObjectURL(file) : null);
                                    }}
                                    className="modal-input"
                                />
                                {previewLogo && (
                                    <div className="preview-logo">
                                        <p>Vista previa del nuevo logo:</p>
                                        <img
                                            src={previewLogo}
                                            alt="Vista previa del logo"
                                            style={{ maxWidth: '100px', marginBottom: '10px' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={handleEditSupplierSubmit}
                                    className="modal-button"
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="modal-button-cancel"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SuppliersAdmin;