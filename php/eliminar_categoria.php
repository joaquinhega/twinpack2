<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$categoriaId = $_POST['id'];

$sql1 = "UPDATE CATEGORIAS SET activo = 0 WHERE id = :categoriaId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);

$ejecucionSQL1->bindParam(':categoriaId', $categoriaId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    echo "Cliente eliminado correctamente";
} else {
    echo "Error al eliminar el cliente";
}

$conexionPDO = null;
$ejecucionSQL1 = null;

die();
?>
