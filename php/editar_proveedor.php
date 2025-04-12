<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$proveedorId = $_POST['id']; 
$newData = $_POST['newData'];
$logo = isset($_FILES['Logo']) ? $_FILES['Logo'] : null;

// Actualizar el nombre del proveedor
$sql1 = "UPDATE PROVEEDORES SET proveedor = :newData WHERE id = :proveedorId";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);
$ejecucionSQL1->bindParam(':newData', $newData, PDO::PARAM_STR);
$ejecucionSQL1->bindParam(':proveedorId', $proveedorId, PDO::PARAM_INT);

if ($ejecucionSQL1->execute()) {
    // Si se envió un nuevo logo, actualizarlo
    if ($logo) {
        $uploadDir = __DIR__ . '/logos/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = uniqid() . '_' . basename($logo['name']);
        $uploadFile = $uploadDir . $fileName;

        if (move_uploaded_file($logo['tmp_name'], $uploadFile)) {
            $sql2 = "UPDATE PROVEEDORES SET logo = :logo WHERE id = :proveedorId";
            $ejecucionSQL2 = $conexionPDO->prepare($sql2);
            $ejecucionSQL2->bindParam(':logo', $fileName, PDO::PARAM_STR);
            $ejecucionSQL2->bindParam(':proveedorId', $proveedorId, PDO::PARAM_INT);
            $ejecucionSQL2->execute();
        }
    }

    echo "Proveedor actualizado correctamente";
} else {
    echo "Error al actualizar el proveedor";
}

$conexionPDO = null;
?>