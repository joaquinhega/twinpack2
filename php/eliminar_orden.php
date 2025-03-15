<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$ordenId = $_POST['id'];
$response = [];

$sql1 = "UPDATE ORDEN SET activo = 0 WHERE id = :ordenId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);

$ejecucionSQL1->bindParam(':ordenId', $ordenId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    $response['status'] = "success";
    $response['message'] = "Orden eliminada correctamente";
    $response['ordenId'] = $ordenId; 
} else {
    $response['status'] = "error";
    $response['message'] = "Error al eliminar la orden";
    $response['ordenId'] = $ordenId;
    $response['errorInfo'] = $ejecucionSQL1->errorInfo();
}

$conexionPDO = null;
$ejecucionSQL1 = null;

echo json_encode($response);
die();
?>