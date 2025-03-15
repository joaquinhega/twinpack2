<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$clienteId = $_POST['id']; 
$newData = $_POST['newData']; 

$sql1 = "UPDATE CLIENTES SET cliente = :newData WHERE id = :clienteId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);

$ejecucionSQL1->bindParam(':newData', $newData, PDO::PARAM_STR);
$ejecucionSQL1->bindParam(':clienteId', $clienteId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    echo "Cliente actualizado correctamente";
} else {
    echo "Error al actualizar el cliente";
}

$conexionPDO = null;
$ejecucionSQL1 = null;

die();
?>
