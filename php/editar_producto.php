<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

if (isset($_POST['id'])) {
    $productId = $_POST['id'];
    $quantity = $_POST['quantity'];
    $price = $_POST['price'];
    $description = $_POST['description'];
    $date = $_POST['date'];
    $number = $_POST['number'];
    $category = $_POST['category'];
    $observations = $_POST['observations'];
    $userId = $_POST['user_id'];

    $sql = "UPDATE ORDENES SET cantidad = :quantity, precio = :price, descripcion = :description, fecha_solicitud = :date, numero_plano = :number, categoria_id = :category, observaciones = :observations, user_id = :userId WHERE id = :productId";
    $stmt = $conexionPDO->prepare($sql);
    $stmt->bindParam(':quantity', $quantity);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':date', $date);
    $stmt->bindParam(':number', $number);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':observations', $observations);
    $stmt->bindParam(':userId', $userId);
    $stmt->bindParam(':productId', $productId);

    if ($stmt->execute()) {
        echo "Producto actualizado correctamente";
    } else {
        echo "Error al actualizar el producto";
    }
} else {
    echo "ID del producto no proporcionado";
}

$conexionPDO = null;
$stmt = null;

die();
?>