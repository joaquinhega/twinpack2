<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$orden_id = isset($_POST['idOrder']) ? $_POST['idOrder'] : 0; 
$selectedPage = isset($_POST['SelectedPage']) ? intval($_POST['SelectedPage']) : 1;
$sort = isset($_POST['Sort']) ? $_POST['Sort'] : 'id'; 
$maxperpage = 300;

$sqlCount = "SELECT COUNT(*) FROM ORDENES WHERE orden_id = :orden_id";
$sqlCount = $conexionPDO->prepare($sqlCount);
$sqlCount->bindParam(':orden_id', $orden_id, PDO::PARAM_INT);
$sqlCount->execute();
$totalItems = $sqlCount->fetchColumn();
$numberPages = ceil($totalItems / $maxperpage);
$offsetItem = ($selectedPage * $maxperpage) - $maxperpage;

$sql = "SELECT 
            ORDENES.id, ORDENES.cantidad, ORDENES.descripcion, ORDENES.fecha_solicitud, ORDENES.categoria_id, ORDENES.numero_plano,
            (SELECT categoria FROM CATEGORIAS WHERE id = ORDENES.categoria_id) AS categoria_nombre,
            ORDENES.precio, ORDENES.estado_id, ORDENES.numero_plano, ORDENES.observaciones, 
            ORDENES.motivo_no_asignacion, ORDENES.user_id
        FROM ORDENES 
        INNER JOIN ESTADOS ON ESTADOS.id = ORDENES.estado_id
        WHERE ORDENES.orden_id = :orden_id AND activo = 1
        ORDER BY ORDENES.$sort 
        LIMIT :maxperpage OFFSET :offsetItem";

$ejecucionSQL = $conexionPDO->prepare($sql);
$ejecucionSQL->bindParam(':orden_id', $orden_id, PDO::PARAM_INT);
$ejecucionSQL->bindParam(':maxperpage', $maxperpage, PDO::PARAM_INT);
$ejecucionSQL->bindParam(':offsetItem', $offsetItem, PDO::PARAM_INT);
$ejecucionSQL->execute();

$items = [];
while ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
    $item = [
        'id' => $filaPDO['id'],
        'quantity' => $filaPDO['cantidad'],
        'description' => $filaPDO['descripcion'],
        'date' => $filaPDO['fecha_solicitud'],
        'number' => $filaPDO['numero_plano'],
        'category' => $filaPDO['categoria_id'],
        'categoria_nombre' => $filaPDO['categoria_nombre'],
        'number' => $filaPDO['numero_plano'],
        'price' => $filaPDO['precio'],
        'estado_id' => $filaPDO['estado_id'],
        'observations' => $filaPDO['observaciones'],
        'motivo_no_asignacion' => $filaPDO['motivo_no_asignacion'],
        'user_id' => $filaPDO['user_id']
    ];
    $items[] = $item;
}
$sql3 = "SELECT id, nombre, 'ARCHIVOS' AS origen
        FROM ARCHIVOS
        WHERE orden_id = :orden_id
        UNION
        SELECT id, nombre, 'ARCHIVOSORDEN' AS origen
        FROM ARCHIVOSORDEN
        WHERE orden_id = :orden_id;";

$ejecucionSQL3 = $conexionPDO->prepare($sql3);
$ejecucionSQL3->bindParam(':orden_id', $orden_id, PDO::PARAM_INT);
$ejecucionSQL3->execute();
$orderFiles = $ejecucionSQL3->fetchAll(PDO::FETCH_ASSOC);

$data = [$numberPages, $items, $orderFiles];
echo json_encode($data);

$conexionPDO = null;
die();
?>
