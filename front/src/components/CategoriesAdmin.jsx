// Seccion de categoria en Admin

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const CategoriesAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [searchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    let history = useHistory();

    useEffect(() => {
        fetchCategories();
    }, []);

    const onChangeNewCategory = (event) => {
        setNewCategory(event.target.value || "");
    };

    const fetchCategories = async () => {
        const response = await fetch('https://twinpack.com.ar/sistema/php/buscar_categorias.php');
//        const response = await fetch('http://localhost/pruebaTwinpack/php/buscar_categorias.php');
        const data = await response.json();
        if (data === "Debe iniciar Sesion") {
        history.push("/");
        } else {
        setCategories(data);
        }
    };

    const handleAddCategory = async () => {
        if (newCategory) {
          const response = await fetch('https://twinpack.com.ar/sistema/php/guardar_categoria.php', {
//            const response = await fetch('http://localhost/pruebaTwinpack/php/guardar_categoria.php', {
                method: 'POST',
                body: new URLSearchParams({
                Categoria: newCategory,
            }),
        });
        const result = await response.text();
        if (result === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            toast.success(result);
            fetchCategories();
            setNewCategory("");
        }
        }
    };

    const handleEditCategory = async (categoryId) => {
        const newCategoryData = prompt("Ingresa los nuevos datos para la categoría");

        if (newCategoryData) {
        const response = await fetch('https://twinpack.com.ar/sistema/php/editar_categoria.php', {
//        const response = await fetch('http://localhost/pruebaTwinpack/php/editar_categoria.php', {
        method: 'POST',
            body: new URLSearchParams({
            id: categoryId,
            newData: newCategoryData,
            }),
        });
        const result = await response.text();
        if (result === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            toast.success(result);
            fetchCategories();
        }
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta categoría?");
        if (confirmDelete) {
        const response = await fetch('https://twinpack.com.ar/sistema/php/eliminar_categoria.php', {
//    const response = await fetch('http://localhost/pruebaTwinpack/php/eliminar_categoria.php', {
        method: 'POST',
            body: new URLSearchParams({
            id: categoryId,
            }),
        });
        const result = await response.text();
        if (result === "Debe iniciar Sesion") {
            history.push("/");
        } else {
            toast.success(result);
            fetchCategories();
        }
        }
    };

    const paginatedCategories = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return categories.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

  return (
    <section>
        <div className="container">
            <div className="container-addbar" style={{ marginTop: '40px' }}>
            <input
                type="text"
                value={newCategory}
                onChange={onChangeNewCategory}
                placeholder="Nueva Categoría"
            />
            <button className="searchbar_form_submit" onClick={handleAddCategory}>Agregar</button>
            </div>
            <div className="categories-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Categoría</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {paginatedCategories()
                .filter(category => category.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(category => (
                    <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.categoria}</td>
                    <td>
                        <div style={{ display: 'flex', gap: '1px' }}>
                        <FaRegEdit
                            className="action-icon"
                            onClick={() => handleEditCategory(category.id)}
                            style={{  display:'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px' , backgroundColor: '#4893e9', borderRadius: '5px' ,cursor: 'pointer', marginRight: '7px' }}
                        />
                        <MdDelete
                            className="action-icon"
                            onClick={() => handleDeleteCategory(category.id)}
                            style={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', backgroundColor: '#D9534F', borderRadius: '5px',cursor: 'pointer' }}
                            />
                        </div>
                    </td>
                    </tr>
                ))}
            </tbody>
            </div>
            <div className="pagination-controls">
            {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }, (_, index) => (
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

export default CategoriesAdmin;