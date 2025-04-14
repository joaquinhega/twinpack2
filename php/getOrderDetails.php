<?php
include_once 'conexion1.php';
include_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderId = $_POST['orderId'];
    error_log("Solicitud recibida para obtener detalles de la orden. orderId: $orderId");

    if (empty($orderId)) {
        error_log("Error: Faltan datos requeridos. orderId no proporcionado.");
        echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos', 'orderId' => $orderId, 'postOrderId' => $_POST['orderId']]);
        exit;
    }

    try {
        $conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
        error_log("Conexión a la base de datos establecida.");

        $sql = "SELECT id, cliente_id, proveedor_id, observaciones, monto_total, (SELECT fecha_solicitud FROM ORDENES WHERE orden_id = :orderId LIMIT 1) AS fecha
                FROM ORDEN
                WHERE id = :orderId";
        $statement = $conexionPDO->prepare($sql);
        $statement->execute(['orderId' => $orderId]);
        $order = $statement->fetch(PDO::FETCH_ASSOC);

        if ($order) {
            error_log("Detalles de la orden obtenidos: " . json_encode($order));

            $proveedorId = $order['proveedor_id'];
            error_log("Obteniendo datos del proveedor con proveedorId: $proveedorId");

            $proveedores = json_decode(file_get_contents('https://twinpack.com.ar/sistema/php/buscar_terceros.php'), true);
//            $proveedores = json_decode(file_get_contents('http://localhost/pruebaTwinpack/php/buscar_terceros.php'), true);

            $proveedor = array_filter($proveedores, function ($item) use ($proveedorId) {
                return $item['id'] == $proveedorId && $item['tipo_other'] == 3;
            });

            $proveedor = reset($proveedor);
            error_log("Proveedor encontrado: " . json_encode($proveedor));

            $sql3 = "SELECT id, nombre, 'ARCHIVOS' AS origen
                     FROM ARCHIVOS
                     WHERE orden_id = :orden_id";
            $statement3 = $conexionPDO->prepare($sql3);
            $statement3->execute(['orden_id' => $orderId]);
            $archivos = $statement3->fetchAll(PDO::FETCH_ASSOC);
            error_log("Archivos relacionados con la orden obtenidos: " . json_encode($archivos));

            $response = array_merge(
                $order,
                ['proveedor' => $proveedor['tercero'] ?? null],
                ['logo' => $proveedor['logo'] ?? null],
                ['archivos' => $archivos]
            );

            error_log("Respuesta final enviada al cliente: " . json_encode($response));
            echo json_encode($response);
        } else {
            error_log("Error: Orden no encontrada. orderId: $orderId");
            echo json_encode(['success' => false, 'message' => 'Orden no encontrada', 'orderId' => $orderId, 'postOrderId' => $_POST['orderId']]);
        }
    } catch (PDOException $e) {
        error_log("Error en la consulta: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Error en la consulta', 'error' => $e->getMessage()]);
    }
}
?>