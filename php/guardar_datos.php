<?php
//conexion
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$motivos = $_POST['Motivos'] ?? null;
$id = $_POST['ID'] ?? null;
$observaciones = $_POST['Observaciones'] ?? null;

$logs = [];
$logs[] = "Motivos: " . print_r($motivos, true);
$logs[] = "ID: " . print_r($id, true);
$logs[] = "Observaciones: " . print_r($observaciones, true);

if ($id === null) {
    die("Error: Datos incompletos recibidos.");
}

$updates = [];
if (!empty($motivos)) {
    $updates[] = "motivo_no_asignacion = '$motivos'";
}
if (!empty($observaciones)) {
    $updates[] = "observaciones = '$observaciones'";
}

if (!empty($updates)) {
    $sql1 = "UPDATE ORDEN SET " . implode(", ", $updates) . " WHERE id='$id'";
    $ejecucionSQL1 = $conexionPDO->prepare($sql1);
    if ($ejecucionSQL1->execute()) {
        $logs[] = "Solicitud editada correctamente";
        $response = ['status' => 'success', 'message' => 'Solicitud editada correctamente', 'logs' => $logs];
    } else {
        $logs[] = "Error al editar la solicitud";
        $response = ['status' => 'error', 'message' => 'Error al editar la solicitud', 'logs' => $logs];
    }
} else {
    $logs[] = "No hay cambios para realizar";
    $response = ['status' => 'info', 'message' => 'No hay cambios para realizar', 'logs' => $logs];
}
echo json_encode($response);

$conexionPDO = null;
$sql1 = null;

die();
?>