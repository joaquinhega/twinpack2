<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$proveedorId = $_POST['id'];

$sql1 = "UPDATE PROVEEDORES SET activo = 0 WHERE id = :proveedorId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);

$ejecucionSQL1->bindParam(':proveedorId', $proveedorId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    echo "Proveedor eliminado correctamente";
} else {
    echo "Error al eliminar el proveedor";
}

$conexionPDO = null;
$ejecucionSQL1 = null;

die();
?>
