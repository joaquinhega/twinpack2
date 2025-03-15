<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$id = intval($_POST['ID']);
$items = array();
$logs = []; 
$logs[] = "ID received from front: " . $_POST['ID']; 

$id_item = null;
$sql = "SELECT ORDENES.id 
        FROM ORDEN 
        INNER JOIN ORDENES ON ORDEN.id = ORDENES.orden_id
        WHERE ORDEN.id = :id
        ORDER BY ORDEN.id DESC
        LIMIT 1";

$ejecucionSQL = $conexionPDO->prepare($sql);
$ejecucionSQL->bindParam(':id', $id, PDO::PARAM_INT);

if ($ejecucionSQL->execute()) {
    $logs[] = "First query executed successfully.";
} else {
    $logs[] = "Error executing first query: " . json_encode($ejecucionSQL->errorInfo());
}

if ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
    $id_item = $filaPDO['id'];
    $logs[] = "Item found: ID = " . $id_item;
} else {
    $logs[] = "No item found for the provided order ID.";
    die(json_encode(["error" => "No se encontró ningún ítem para la orden proporcionada.", "logs" => $logs]));
}

if (!is_null($id_item)) {
    $sql = "SELECT ESTADOS.estado, SEGUIMIENTOS.visible, SEGUIMIENTOS.fecha, SEGUIMIENTOS.fecha_entrega
            FROM ESTADOS
            LEFT JOIN SEGUIMIENTOS 
            ON ESTADOS.id = SEGUIMIENTOS.estado_id AND SEGUIMIENTOS.orden_id = :id_item";

    $ejecucionSQL = $conexionPDO->prepare($sql);
    $ejecucionSQL->bindParam(':id_item', $id_item, PDO::PARAM_INT);

    if ($ejecucionSQL->execute()) {
        $logs[] = "Second query executed successfully.";
    } else {
        $logs[] = "Error executing second query: " . json_encode($ejecucionSQL->errorInfo());
    }

    while ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
        $item = new stdClass();
        $item->dd = is_null($filaPDO['visible']) ? 1 : $filaPDO['visible'];
        $item->d = is_null($filaPDO['visible']) ? 1 : $filaPDO['visible'];
        $item->status = $filaPDO['estado'];
        $item->created = ($filaPDO['fecha'] == '0000-00-00') ? '' : $filaPDO['fecha'];
        $item->entrega = ($filaPDO['fecha_entrega'] == '0000-00-00') ? '' : $filaPDO['fecha_entrega'];

        array_push($items, $item);
    }

    $logs[] = "Items retrieved: " . count($items);
}

$response = [
    "items" => $items,
    "logs" => $logs,
];

echo json_encode($response);
$conexionPDO = null;
?>
