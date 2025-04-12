<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$items = array();

// Obtener clientes
$sql = "SELECT * FROM CLIENTES WHERE activo = 1 ORDER BY cliente";
$ejecucionSQL = $conexionPDO->prepare($sql);
$ejecucionSQL->execute();
while ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
    $item = new stdClass();
    $item->id = $filaPDO['id'];  
    $item->tercero = $filaPDO['cliente'];
    $item->tipo_other = 2;
    array_push($items, $item);
}

// Obtener proveedores
$sql = "SELECT * FROM PROVEEDORES WHERE activo = true ORDER BY proveedor";
$ejecucionSQL = $conexionPDO->prepare($sql);
$ejecucionSQL->execute();
while ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
    $item = new stdClass();
    $item->id = $filaPDO['id'];  
    $item->tercero = $filaPDO['proveedor'];
    $item->logo = $filaPDO['logo']; 
    $item->tipo_other = 3;
    array_push($items, $item);
}

echo json_encode($items);

$conexionPDO = null;
$sql1 = null;

die();
?>