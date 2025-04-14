<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$logs = []; // Array para almacenar los logs

$proveedorId = $_POST['id']; 
$newData = $_POST['newData'];
$logo = isset($_FILES['Logo']) ? $_FILES['Logo'] : null;

$logs[] = "Inicio del proceso de edición del proveedor. ID: $proveedorId, Nuevo Nombre: $newData";
$logs[] = "Logo recibido: " . print_r($logo, true); // Log para verificar el archivo recibido

// Actualizar el nombre del proveedor
$sql1 = "UPDATE PROVEEDORES SET proveedor = :newData WHERE id = :proveedorId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);
$ejecucionSQL1->bindParam(':newData', $newData, PDO::PARAM_STR);
$ejecucionSQL1->bindParam(':proveedorId', $proveedorId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    $logs[] = "Nombre del proveedor actualizado correctamente.";

    // Si se envió un nuevo logo, actualizarlo
    if ($logo) {
        $uploadDir = __DIR__ . '/logos/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
            $logs[] = "Directorio de logos creado: $uploadDir";
        }

        $fileName = uniqid() . '_' . basename($logo['name']);
        $uploadFile = $uploadDir . $fileName;

        if (move_uploaded_file($logo['tmp_name'], $uploadFile)) {
            $logs[] = "Logo cargado correctamente en: $uploadFile";

            $sql2 = "UPDATE PROVEEDORES SET logo = :logo WHERE id = :proveedorId";
            $ejecucionSQL2 = $conexionPDO->prepare($sql2);
            $ejecucionSQL2->bindParam(':logo', $fileName, PDO::PARAM_STR);
            $ejecucionSQL2->bindParam(':proveedorId', $proveedorId, PDO::PARAM_INT);

            if ($ejecucionSQL2->execute()) {
                $logs[] = "Logo del proveedor actualizado en la base de datos.";
            } else {
                $logs[] = "Error al actualizar el logo en la base de datos.";
            }
        } else {
            $logs[] = "Error al mover el archivo del logo a la carpeta de destino.";
        }
    } else {
        $logs[] = "No se envió un nuevo logo.";
    }

    $response = [
        'success' => true,
        'message' => "Proveedor actualizado correctamente",
        'logs' => $logs
    ];
} else {
    $logs[] = "Error al actualizar el nombre del proveedor.";
    $response = [
        'success' => false,
        'message' => "Error al actualizar el proveedor",
        'logs' => $logs
    ];
}

$conexionPDO = null;

// Devolver la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>