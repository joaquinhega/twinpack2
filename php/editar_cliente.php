<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$logs = []; // Array para almacenar los logs

$clienteId = $_POST['id']; 
$newData = $_POST['newData']; 

$logs[] = "Inicio del proceso de edición del cliente. ID: $clienteId, Nuevo Nombre: $newData";

// Actualizar el nombre del cliente
$sql1 = "UPDATE CLIENTES SET cliente = :newData WHERE id = :clienteId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);
$ejecucionSQL1->bindParam(':newData', $newData, PDO::PARAM_STR);
$ejecucionSQL1->bindParam(':clienteId', $clienteId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    $logs[] = "Nombre del cliente actualizado correctamente.";
    $response = [
        'success' => true,
        'message' => "Clienteeeeeeeee actualizado correctamente",
        'logs' => $logs
    ];
} else {
    $logs[] = "Error al actualizar el nombre del cliente.";
    $response = [
        'success' => false,
        'message' => "Error al actualizar el cliente",
        'logs' => $logs
    ];
}

$conexionPDO = null;

// Devolver la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>