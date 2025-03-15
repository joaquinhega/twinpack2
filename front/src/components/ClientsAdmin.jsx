// Seccion de clientes en Admin

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ClientsAdmin = () => {
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState("");
    const [searchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    let history = useHistory();

    useEffect(() => {
        fetchClients();
    }, []);

    const onChangeNewClient = (event) => {
        setNewClient(event.target.value || "");
    };

    const fetchClients = async () => {
        const response = await fetch('https://twinpack.com.ar/sistema/php/buscar_terceros.php');
        const data = await response.json();
        if (data === "Debe iniciar Sesion") {
        history.push("/");
        } else {
        setClients(data.filter(client => client.tipo_other === 2)); 
        }
    };

    const handleAddClient = async () => {
        if (newClient) {
        const response = await fetch('https://twinpack.com.ar/sistema/php/guardar_cliente.php', {
            method: 'POST',
            body: new URLSearchParams({
            Cliente: newClient,
            }),
        });
        const result = await response.text();
        if (result === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            toast.success(result);
            fetchClients();
            setNewClient("");
        }
        }
    };

    const handleEditClient = async (clientId) => {
        const newClientData = prompt("Ingresa los nuevos datos para el cliente");
        if (newClientData) {
        const response = await fetch('https://twinpack.com.ar/sistema/php/editar_cliente.php', {
            method: 'POST',
            body: new URLSearchParams({
            id: clientId,
            newData: newClientData,
            }),
        });
        const result = await response.text();
        if (result === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            toast.success(result);
            fetchClients();
        }
        }
    };

        const handleDeleteClient = async (clientId) => {
            const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
            if (confirmDelete) {
            const response = await fetch('https://twinpack.com.ar/sistema/php/eliminar_cliente.php', {
                method: 'POST',
                body: new URLSearchParams({
                id: clientId,
                }),
            });
            const result = await response.text();
            if (result === "Debe iniciar Sesion") {
                history.push("/");
            } else {
                toast.success(result);
                fetchClients();
            }
            }
        };

    const paginatedClients = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return clients.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

  return (
    <section>
        <div className="container-client">
            <div className="container-addbar">
            <input
                type="text"
                value={newClient}
                onChange={onChangeNewClient}
                placeholder="Nuevo Cliente"
            />
            <button className="searchbar_form_submit" onClick={handleAddClient}>
                Agregar
            </button>
            </div>
            <div className="categories-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {paginatedClients()
                .filter(client => client.tercero.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(client => (
                    <tr key={client.id}>
                    <td>{client.id}</td>  
                    <td>{client.tercero}</td>
                    <td>
                        <div style={{ display: 'flex', gap: '1px' }}>
                        <FaRegEdit
                            className="action-icon"
                            onClick={() => handleEditClient(client.id)}
                            style={{  display:'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px' , backgroundColor: '#4893e9', borderRadius: '5px' ,cursor: 'pointer', marginRight: '7px' }}
                        />
                        <MdDelete
                            className="action-icon"
                            onClick={() => handleDeleteClient(client.id)}
                            style={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', backgroundColor: '#D9534F', borderRadius: '5px',cursor: 'pointer' }}
                            />
                        </div>
                    </td>
                    </tr>
                ))}
            </tbody>
            </div>
            <div className="pagination-controls">
            {Array.from({ length: Math.ceil(clients.length / itemsPerPage) }, (_, index) => (
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

export default ClientsAdmin;