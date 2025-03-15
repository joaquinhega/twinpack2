<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$itemId = $_POST['id'];

$sql1 = "UPDATE ORDENES SET activo = 0 WHERE id = :itemId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);

$ejecucionSQL1->bindParam(':itemId', $itemId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    echo "Producto eliminado correctamente";
} else {
    echo "Error al eliminar el producto";
}

$conexionPDO = null;
$ejecucionSQL1 = null;

die();
?>
