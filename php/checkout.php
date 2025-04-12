<?php
include_once 'cors.php';
include_once 'conexion1.php';
$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$logs = [];
try {
    if ($_POST['orderItems'] != 0) {
        $orderItems = json_decode($_POST['orderItems'], true);
        $order_id = $_POST['order_id'];
        $source = $_POST['source'] ?? ''; 
        $logs[] = "Source: $source";
        $total_amount = 0;

        foreach ($orderItems as $item) {
            $quantity = $item['quantity'];
            $price = $item['price'];
            $description = $item['description'] ?? '';
            $date = $item['date'];
            $code = $item['code'] ?? '';
            $number = $item['number'] ?? '';
            $observations = $item['observations'] ?? '';
            $user_id = $item['user_id'];
            $category = $item['category'];

            $sql1 = "INSERT INTO ORDENES (cantidad, precio, descripcion, fecha_solicitud, codigo_producto, numero_plano, observaciones, estado_id, user_id, categoria_id, orden_id, activo) 
            VALUES (:quantity, :price, :description, :date, :code, :number, :observations, 1, :user_id, :category, :order_id, 1)";

            $statement = $conexionPDO->prepare($sql1);
            $statement->execute([
                ':quantity' => $quantity,
                ':price' => $price,
                ':description' => $description,
                ':date' => $date,
                ':code' => $code,
                ':number' => $number,
                ':observations' => $observations,
                ':user_id' => $user_id,
                ':category' => $category,
                ':order_id' => $order_id
            ]);
            $logs[] = "Producto agregado: cantidad=$quantity, precio=$price, descripción=$description";

            if ($source === "OrderDetailModal") {
                $total_amount += $quantity * $price;
            }
        }

        if ($source === "OrderDetailModal") {
            $sql2 = "UPDATE ORDEN SET monto_total = monto_total + :total_amount WHERE id = :order_id";
            $statement2 = $conexionPDO->prepare($sql2);
            $statement2->execute([
                ':total_amount' => $total_amount,
                ':order_id' => $order_id
            ]);
            $logs[] = "Monto total actualizado: monto_total+= $total_amount para orden_id=$order_id";
        }
    } else {
        $quantity = $_POST['quantity'];
        $price = $_POST['price'];
        $description = $_POST['description'] ?? '';
        $date = $_POST['date'];
        $code = $_POST['code'] ?? '';
        $number = $_POST['number'] ?? '';
        $observations = $_POST['observations'] ?? '';
        $user_id = $_POST['user_id'];
        $category = $_POST['category'];
        $order_id = $_POST['order_id'];

        $sql1 = "INSERT INTO ORDENES (cantidad, precio, descripcion, fecha_solicitud, codigo_producto, numero_plano, observaciones, estado_id, user_id, categoria_id, orden_id, activo) 
        VALUES (:quantity, :price, :description, :date, :code, :number, :observations, 1, :user_id, :category, :order_id, 1)";

        $statement = $conexionPDO->prepare($sql1);
        $statement->execute([
            ':quantity' => $quantity,
            ':price' => $price,
            ':description' => $description,
            ':date' => $date,
            ':code' => $code,
            ':number' => $number,
            ':observations' => $observations,
            ':user_id' => $user_id,
            ':category' => $category,
            ':order_id' => $order_id
        ]);

        $logs[] = "Producto agregado correctamente: cantidad=$quantity, precio=$price, descripción=$description";
        
        if($source === "OrderDetailModal") {
            $total_amount += $quantity * $price;
            $total_amount = $quantity * $price;
            $logs[] = "Monto Total: $total_amount";

            $sql2 = "UPDATE ORDEN SET monto_total = :total_amount WHERE id = :order_id";
            $statement2 = $conexionPDO->prepare($sql2);
            $statement2->execute([
                ':total_amount' => $total_amount,
                ':order_id' => $order_id
            ]);

            $logs[] = "Monto total actualizado: monto_total+= $total_amount para orden_id=$order_id";
        }
    }
    echo json_encode(["message" => "Producto agregado correctamente", "logs" => $logs]);

} catch (PDOException $e) {
    $logs[] = "Error: " . $e->getMessage();
    echo json_encode(["error" => "Ocurrió un error al procesar la solicitud", "logs" => $logs]);
}
$conexionPDO = null;
?>