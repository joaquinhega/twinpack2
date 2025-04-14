<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$categoriaId = $_POST['id']; 
$newData = $_POST['newData']; 

$sql1 = "UPDATE CATEGORIAS SET categoria = :newData WHERE id = :categoriaId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);

$ejecucionSQL1->bindParam(':newData', $newData, PDO::PARAM_STR);
$ejecucionSQL1->bindParam(':categoriaId', $categoriaId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    echo "Categoria actualizado correctamente";
} else {
    echo "Error al actualizar la categoria";
}

$conexionPDO = null;
$ejecucionSQL1 = null;

die();
?>
