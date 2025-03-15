<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$estados_item = $_POST['StatusItems'] ?? null;
$id = $_POST['ID'] ?? null;

if ($estados_item === null || $id === null) {
    die("Error: Datos incompletos recibidos.");
}

$estados_array = json_decode($estados_item, true, 512, JSON_OBJECT_AS_ARRAY);

$ultimo_estado = '';
for ($z = 0; $z < count($estados_array); $z++) {
    if ($estados_array[$z]["created"] != "") {
        $ultimo_estado = $estados_array[$z]["status"];
    }
}
$sql1 = "UPDATE ORDENES SET estado_id = (SELECT id FROM ESTADOS WHERE estado = '$ultimo_estado')
        WHERE orden_id='$id'";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);
if ($ejecucionSQL1->execute()) {
    $logs[] = "Estados editados correctamente";
} else {
    $logs[] = "Error al editar los estados";
}

$items_id = array();
$sql = "SELECT id FROM ORDENES WHERE orden_id = $id";
$ejecucionSQL = $conexionPDO->prepare($sql);
$ejecucionSQL->execute();
while ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
    array_push($items_id, $filaPDO['id']);
}

$logs[] = "Cantidad de items a cambiar: " . count($items_id);
for ($w = 0; $w < count($items_id); $w++) {
    $id_item = $items_id[$w];
    $sql1 = "DELETE FROM SEGUIMIENTOS WHERE orden_id='$id_item'";
    $ejecucionSQL1 = $conexionPDO->prepare($sql1);
    $ejecucionSQL1->execute();

    for ($z = 0; $z < count($estados_array); $z++) {
        $visible = $estados_array[$z]["dd"];
        $estado = $estados_array[$z]["status"];
        $created = $estados_array[$z]["created"];
                
        $sql1 = "INSERT INTO SEGUIMIENTOS (orden_id, visible, estado_id, fecha)
        VALUES($id_item, $visible, (SELECT id FROM ESTADOS WHERE estado = '$estado'), '$created')";
        $ejecucionSQL1 = $conexionPDO->prepare($sql1);
        $ejecucionSQL1->execute();
    }
}

$conexionPDO = null;
$sql1 = null;

die();
?>