<?php
include_once 'cors.php';
include_once 'conexion1.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$logs = [];
try {
    $logs[] = "Inicio del proceso de orden.";

    $orderItems = json_decode($_POST['orderItems'], true);
    $order_id = $_POST['order_id'];
    $source = $_POST['source'] ?? '';

    $logs[] = "Order ID: $order_id, Source: $source";
    $logs[] = "Order Items (raw): " . $_POST['orderItems'];

    // Función para insertar un item de la orden
    function insertOrderItem($pdo, $item, $orderId, &$logs) {
        $sql = "INSERT INTO ORDENES (cantidad, precio, descripcion, fecha_solicitud, codigo_producto, numero_plano, observaciones, estado_id, user_id, categoria_id, orden_id, activo) 
                VALUES (:quantity, :price, :description, :date, :code, :number, :observations, 1, :user_id, :category, :order_id, 1)";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':quantity' => $item['quantity'],
            ':price' => $item['price'],
            ':description' => $item['description'] ?? '',
            ':date' => $item['date'],
            ':code' => $item['code'] ?? '',
            ':number' => $item['number'] ?? '',
            ':observations' => $item['observations'] ?? '',
            ':user_id' => $item['user_id'],
            ':category' => $item['category'],
            ':order_id' => $orderId
        ]);
        $logs[] = "Producto agregado: cantidad={$item['quantity']}, precio={$item['price']}, descripción={$item['description']}";
    }

    // Procesar orderItems como un array o un objeto único
    if (is_array($orderItems) && count($orderItems) > 0) {
        foreach ($orderItems as $item) {
            insertOrderItem($conexionPDO, $item, $order_id, $logs);
        }
    } else {
        // Asumiendo que orderItems es un objeto único
        $singleItem = [
            'quantity' => $_POST['quantity'],
            'price' => $_POST['price'],
            'description' => $_POST['description'] ?? '',
            'date' => $_POST['date'],
            'code' => $_POST['code'] ?? '',
            'number' => $_POST['number'] ?? '',
            'observations' => $_POST['observations'] ?? '',
            'user_id' => $_POST['user_id'],
            'category' => $_POST['category']
        ];
        insertOrderItem($conexionPDO, $singleItem, $order_id, $logs);
    }

    // Actualizar monto total si viene de OrderDetailModal
    if ($source === "OrderDetailModal") {
        $sqlTotal = "SELECT SUM(cantidad * precio) as total FROM ORDENES WHERE orden_id = :order_id";
        $statementTotal = $conexionPDO->prepare($sqlTotal);
        $statementTotal->execute([':order_id' => $order_id]);
        $total = $statementTotal->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

        $sqlUpdateTotal = "UPDATE ORDEN SET monto_total = :total WHERE id = :order_id";
        $statementUpdateTotal = $conexionPDO->prepare($sqlUpdateTotal);
        $statementUpdateTotal->execute([':total' => $total, ':order_id' => $order_id]);
        $logs[] = "Monto total actualizado: $total para orden_id=$order_id";
    }

    echo json_encode(["message" => "Producto(s) agregado(s) correctamente", "logs" => $logs]);

} catch (PDOException $e) {
    $logs[] = "Error PDO: " . $e->getMessage();
    echo json_encode(["error" => "Ocurrió un error al procesar la solicitud", "logs" => $logs]);
} catch (Exception $e) {
    $logs[] = "Error General: " . $e->getMessage();
    echo json_encode(["error" => "Ocurrió un error inesperado", "logs" => $logs]);
} finally {
    $conexionPDO = null;
}
?>