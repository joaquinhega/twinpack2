<?php
include_once 'conexion1.php';
include_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderId = $_POST['orderId'];
    if (empty($orderId)) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos', 'orderId' => $orderId, 'postOrderId' => $_POST['orderId']]);
        exit;
    }
    try {
        $conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
        $sql = "SELECT id, cliente_id, proveedor_id, observaciones, monto_total
                FROM ORDEN
                WHERE id = :orderId";
        $statement = $conexionPDO->prepare($sql);
        $statement->execute(['orderId' => $orderId]);
        $order = $statement->fetch(PDO::FETCH_ASSOC);

        $sql3 = "SELECT id, nombre, 'ARCHIVOS' AS origen
                 FROM ARCHIVOS
                 WHERE orden_id = :orden_id
                 UNION
                 SELECT id, nombre, 'ARCHIVOSORDEN' AS origen
                 FROM ARCHIVOSORDEN
                 WHERE orden_id = :orden_id";
        $statement3 = $conexionPDO->prepare($sql3);
        $statement3->execute(['orden_id' => $orderId]);
        $archivos = $statement3->fetchAll(PDO::FETCH_ASSOC);

        if ($order) {

            echo json_encode(array_merge($order, ['archivos' => $archivos, 'orderId' => $orderId, 'postOrderId' => $_POST['orderId']]));
        } else {
            echo json_encode(['success' => false, 'message' => 'Orden no encontrada', 'orderId' => $orderId, 'postOrderId' => $_POST['orderId']]);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en la consulta', 'error' => $e->getMessage()]);
    }
}
?>