<?php
include_once 'cors.php';
include_once 'conexion1.php';
$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$items = array();
$sql = "SELECT * FROM CATEGORIAS WHERE activo = true ORDER BY categoria";
$ejecucionSQL = $conexionPDO->prepare($sql);
$ejecucionSQL->execute();
while ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
    $item = new stdClass();
    $item->id = $filaPDO['id']; 
    $item->categoria = $filaPDO['categoria'];
    array_push($items, $item);
}
echo json_encode($items);

$conexionPDO = null;
$sql1 = null;

die();
?>