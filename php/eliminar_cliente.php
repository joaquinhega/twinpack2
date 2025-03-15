<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$clienteId = $_POST['id'];

$sql1 = "UPDATE CLIENTES SET activo = 0 WHERE id = :clienteId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);

$ejecucionSQL1->bindParam(':clienteId', $clienteId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    echo "Cliente eliminado correctamente";
} else {
    echo "Error al eliminar el cliente";
}

$conexionPDO = null;
$ejecucionSQL1 = null;

die();
?>
