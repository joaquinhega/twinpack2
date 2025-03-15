<?php
include_once '../php/conexion1.php';
$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$maxperpage = 300;
$selectedPage = isset($_POST['SelectedPage']) ? intval($_POST['SelectedPage']) : 1;
$offsetItem = ($selectedPage * $maxperpage) - $maxperpage;

$response = array();
$items = array();
$logData = array();

try {
    $sqlCount = "SELECT COUNT(*) FROM Orden";
    $sqlCount = $conexionPDO->prepare($sqlCount);
    $sqlCount->execute();
    $totalItems = $sqlCount->fetchColumn();
    $numberPages = ceil($totalItems / $maxperpage);

    $sql = "SELECT 
            o.id AS id_orden,
            c.cliente,
            (
                SELECT cat.categoria 
                FROM CATEGORIAS cat
                WHERE cat.id = (
                    SELECT ord.categoria_id 
                    FROM ORDENES ord 
                    WHERE ord.orden_id = o.id 
                    LIMIT 1
                )
            ) AS categoria,
            p.proveedor,
            o.observaciones,
            o.monto_total,
            (
                SELECT e.estado 
                FROM ESTADOS e
                WHERE e.id = (
                    SELECT ord.estado_id 
                    FROM ORDENES ord 
                    WHERE ord.orden_id = o.id 
                    LIMIT 1
                )
            ) AS estado,
            (
                SELECT ord.fecha_solicitud
                FROM ORDENES ord
                WHERE ord.orden_id = o.id
                LIMIT 1
            ) AS fecha_entrega,
            DATEDIFF(
                (SELECT ord.fecha_solicitud FROM ORDENES ord WHERE ord.orden_id = o.id LIMIT 1), 
                CURRENT_DATE
            ) AS delay
        FROM ORDEN o
        INNER JOIN CLIENTES c ON c.id = o.cliente_id
        INNER JOIN PROVEEDORES p ON p.id = o.proveedor_id
        WHERE o.activo = 1 AND o.recibida = 1
        ORDER BY o.id DESC
        LIMIT :maxperpage OFFSET :offsetItem";

    $ejecucionSQL = $conexionPDO->prepare($sql);
    $ejecucionSQL->bindParam(":maxperpage", $maxperpage, PDO::PARAM_INT);
    $ejecucionSQL->bindParam(":offsetItem", $offsetItem, PDO::PARAM_INT);
    $ejecucionSQL->execute();

    while ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
        $item = new stdClass();
        $item->id = $filaPDO['id_orden'];
        $item->numero_orden = "S" . str_pad($filaPDO['id_orden'], 6, "0", STR_PAD_LEFT);
        $item->cliente = $filaPDO['cliente'];
        $item->categoria = $filaPDO['categoria'];
        $item->proveedor = $filaPDO['proveedor'];
        $item->monto_total = $filaPDO['monto_total'];
        $item->estado = $filaPDO['estado'];
        $item->fecha_entrega = $filaPDO['fecha_entrega'];
        $item->observaciones = $filaPDO['observaciones'];
        $item->delay = $filaPDO['delay'];
        $items[] = $item;
    }

    $response = array('numberPages' => $numberPages, 'items' => $items);
} catch (Exception $e) {
    $response = array('error' => true, 'message' => $e->getMessage(), 'logs' => $logData);
}

echo json_encode($response);
?>