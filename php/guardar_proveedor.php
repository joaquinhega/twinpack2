<?php
// Conexión
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

if (isset($_POST['Proveedor'])) {
    $proveedor = $_POST['Proveedor'];
    $logo = isset($_FILES['Logo']) ? $_FILES['Logo'] : null;

    $uploadDir = __DIR__ . '/logos/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true); 
    }

    $fileName = null; // Inicializar como null
    if ($logo) {
        $fileName = uniqid() . '_' . basename($logo['name']);
        $uploadFile = $uploadDir . $fileName;

        if (!move_uploaded_file($logo['tmp_name'], $uploadFile)) {
            echo "Error al subir el archivo";
            exit;
        }
    }

    $sql1 = "INSERT INTO PROVEEDORES (proveedor, logo, activo) VALUES (:proveedor, :logo, 1)";
    $ejecucionSQL1 = $conexionPDO->prepare($sql1);
    $ejecucionSQL1->bindParam(':proveedor', $proveedor);
    $ejecucionSQL1->bindParam(':logo', $fileName); // Si no hay logo, se enviará null

    if ($ejecucionSQL1->execute()) {
        echo "Proveedor guardado correctamente";
    } else {
        echo "Error al guardar los datos en la base de datos";
    }
} else {
    echo "Faltan datos requeridos";
}

$conexionPDO = null;
?>